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

import { ApiNetwork } from "../models/StorageTypes"

export const MAP: ApiNetwork[] = [

    {
        key: "main",
        protocol: "https",
        host: "beaconcha.in",
        net: "",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: false,
        active: true,
        genesisTs: 1606824023
    },

    {
        key: "prater",
        protocol: "https",
        host: "beaconcha.in",
        net: "prater.",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: false,
        active: true,
        genesisTs: 1614588812
    },
    
    {
        key: "pyrmont",
        protocol: "https",
        host: "beaconcha.in",
        net: "pyrmont.",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: false,
        active: true,
        genesisTs: 1605700807
    },

    {
        key: "medalla",
        protocol: "https",
        host: "beaconcha.in",
        net: "medalla.",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: false,
        active: true,
        genesisTs: 1596546008
    },

    {
        key: "zinken",
        protocol: "https",
        host: "beaconcha.in",
        net: "zinken.",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: false,
        active: true,
        genesisTs: 1602504000
    },

    {
        key: "toledo",
        protocol: "https",
        host: "beaconcha.in",
        net: "toledo.",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: false,
        active: true,
        genesisTs: 1605009608
    },

    {
        key: "local dev",
        protocol: "http",
        host: "192.168.0.124:3333",
        net: "",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: true,
        active: true,
        genesisTs: 1605009608 // Arbitrary, doesnt matter on local
    },
    
    {
        key: "invalid (no connection)",
        protocol: "http",
        host: "0.0.0.0",
        net: "",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: true,
        active: true,
        genesisTs: 1605009608 // Arbitrary, doesnt matter on invalid connection
    },

    {
        key: "testing 2",
        protocol: "http",
        host: "34.68.171.198",
        net: "",
        endpoint: "/api/",
        version: "v1",
        onlyDebug: true,
        active: true,
        genesisTs: 1605009608 // Arbitrary, doesnt matter on invalid connection
    },
]

export function findConfigForKey(key: string): ApiNetwork {
    for (let entry of MAP) {
        if (entry.key == key) return entry
    }
    return MAP[0]
}

