/* 
 *  // Copyright (C) 2020 - 2021 Bitfly GmbH
 *  // Manuel Caspari (manuel@bitfly.at)
 *  // 
 *  // This file is part of Beaconchain Dashboard.
 *  // 
 *  // Beaconchain Dashboard is free software: you can redistribute it and/or modify
 *  // it under the terms of the GNU General Public License as published by
 *  // the Free Software Foundation, either version 3 of the License, or
 *  // (at your option) any later version.
 *  // 
 *  // Beaconchain Dashboard is distributed in the hope that it will be useful,
 *  // but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  // GNU General Public License for more details.
 *  // 
 *  // You should have received a copy of the GNU General Public License
 *  // along with Beaconchain Dashboard.  If not, see <http://www.gnu.org/licenses/>.
 */

import { StorageService } from "../services/storage.service";
import { Injectable } from '@angular/core';
import { NavigationBarPlugin } from 'capacitor-navigationbarnx';
import {
    Plugins,
    StatusBarStyle,
} from '@capacitor/core';
import { Platform } from '@ionic/angular';
import * as Snowflakes from 'magic-snowflakes';
import confetti from 'canvas-confetti';

const { StatusBar } = Plugins;
const NavigationBar = Plugins.NavigationBar as NavigationBarPlugin;

enum Theme {
    DARK, LIGHT
}

interface ThemeStorage {
    theme: Theme
}

const STORAGE_KEY = "theme"

@Injectable({
    providedIn: 'root'
})
export default class ThemeUtils {

    userPreference: Theme
    currentThemeColor: string = ""
    private lock: Promise<void | ThemeStorage>

    private snowFlakes

    constructor(
        private storage: StorageService,
        private platform: Platform
    ) { }

    async init(splashScreenCallback: () => void) {
        this.lock = this.storage.getObject(STORAGE_KEY).then(
            (preferenceDarkMode) => {
                this.internalInit(preferenceDarkMode)
                setTimeout(() => {
                    this.colorHandler()
                    splashScreenCallback()
                }, 600)
                return preferenceDarkMode
            }
        )
    }

    private internalInit(preferenceDarkMode) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        if (preferenceDarkMode) {
            this.userPreference = preferenceDarkMode.theme
            this.currentThemeColor = preferenceDarkMode.themeColor
        } else {
            this.userPreference = prefersDark.matches ? Theme.DARK : Theme.LIGHT
        }

        this.toggle(this.userPreference == Theme.DARK, false, this.currentThemeColor)

        if (this.isSilvester()) {
            setTimeout(
                () => {
                    this.silvesterFireworks()
                }, 3200
            )
        }
    }

    undoColor(themeColor: string = this.currentThemeColor) {
        if(themeColor && themeColor != "") document.body.classList.remove(themeColor);
    }

    async toggle(darkModeEnabled: boolean, setColorHandler: boolean = true, themeColor: string = this.currentThemeColor) {
        document.body.classList.toggle('dark', darkModeEnabled);
        if(themeColor && themeColor != "") document.body.classList.toggle(themeColor, true);
        if (setColorHandler) this.colorHandler()
        const themeString = darkModeEnabled ? Theme.DARK : Theme.LIGHT
        this.storage.setObject(STORAGE_KEY, { theme: themeString, themeColor: themeColor })
        this.userPreference = themeString
        this.currentThemeColor = themeColor

        this.toggleWinter(await this.isWinterEnabled(), false)
    }

    async isWinterEnabled() {
        if (!this.isWinterSeason()) return false;
        const temp = (await this.storage.getBooleanSetting("snow_enabled", true))
        return temp
    }

    isWinterSeason() {
        var d = new Date();
        return d.getMonth() == 11 && d.getDate() >= 24 && d.getDate() <= 27
    }

    isSilvester() {
        var d = new Date();
        const silvesterday = d.getMonth() == 11 && d.getDate() == 31 && d.getHours() == 23
        const januaryFirst = d.getMonth() == 0 && d.getDate() == 1 && d.getHours() == 0
        return silvesterday || januaryFirst
    }

    // TODO: Should start thinking about increasing the minimum system requirements for this app ¯\_(ツ)_/¯
    private silvesterFireworks() {
        var duration = 10 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 100, ticks: 70, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function () {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            var particleCount = 20 * (timeLeft / duration);

            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 350);
    }

    toggleWinter(enabled, saveWinterSetting = true) {
        if (this.snowFlakes) {
            try {
                this.snowFlakes.destroy()
            } catch (error) { }
        }
        if (this.isWinterSeason() && saveWinterSetting) this.storage.setBooleanSetting("snow_enabled", enabled)

        if (!enabled) return;
        this.snowFlakes = this.winterSeason(this.userPreference == Theme.DARK)
    }

    async getThemeColor() {
        await this.lock;
        return this.currentThemeColor
    }

    async isDarkThemed() {
        await this.lock;
        return this.userPreference == Theme.DARK;
    }

    private async colorHandler() {
        const color = getComputedStyle(document.body).getPropertyValue("--ion-toolbar-background")
        const isDarkThemed = await this.isDarkThemed()
        this.changeStatusBarColor(color, isDarkThemed)
        this.changeNavigationBarColor(isDarkThemed)
    }

    private async changeNavigationBarColor(isDarkThemed) {
        if (isDarkThemed) NavigationBar.setBackgroundColor({ color: '#000000' });
        else NavigationBar.setBackgroundColor({ color: '#f7f7f7' });
    }

    private async changeStatusBarColor(color, isDarkThemed) {
        if (this.platform.is("android")) {
            const darker = isDarkThemed ? "#000000" : this.shadeColor(color, -12)

            StatusBar.setStyle({
                style: StatusBarStyle.Dark
            });
            StatusBar.setBackgroundColor({
                color: darker
            })
        }
    }

    private getSnowFlakeColor(darkTheme: boolean) {
        return darkTheme ? '#fff' : '#5ECDEF';
    }

    private winterSeason(darkTheme: boolean) {
        if (!this.isWinterSeason()) return false;
        return Snowflakes({
            color: this.getSnowFlakeColor(darkTheme), // Default: "#5ECDEF"
            count: 14, // 100 snowflakes. Default: 50
            minOpacity: 0.1, // From 0 to 1. Default: 0.6
            maxOpacity: 0.95, // From 0 to 1. Default: 1
            minSize: 8, // Default: 8
            maxSize: 15, // Default: 18
            rotation: true, // Default: true
            speed: 1, // The property affects the speed of falling. Default: 1
            wind: false, // Without wind. Default: true
        })
    }

    private shadeColor(color_: string, percent: number): string {
        const color = color_.trim()
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = Math.round(R * ((100 + percent) / 100));
        G = Math.round(G * ((100 + percent) / 100));
        B = Math.round(B * ((100 + percent) / 100));

        R = (R < 255) ? R < 0 ? 0 : R : 255;
        G = (G < 255) ? G < 0 ? 0 : G : 255;
        B = (B < 255) ? B < 0 ? 0 : B : 255;

        const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }
}