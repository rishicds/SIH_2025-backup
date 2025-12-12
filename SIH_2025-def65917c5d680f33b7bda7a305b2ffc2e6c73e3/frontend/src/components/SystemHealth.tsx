"use client";

import {
  Wifi,
  WifiOff,
  Signal,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, Badge } from "./UI";
import useStore from "@/store/useStore";

export const SystemHealth = () => {
  const system = useStore((state) => state.system);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50)
      return { label: "Excellent", color: "text-green-600", bars: 4 };
    if (rssi > -60) return { label: "Good", color: "text-primary", bars: 3 };
    if (rssi > -70) return { label: "Fair", color: "text-yellow-600", bars: 2 };
    return { label: "Poor", color: "text-red-600", bars: 1 };
  };

  const signal = getSignalStrength(system.rssi);

  return (
    <Card className="h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-primary" />
        System Health
      </h2>

      {/* WiFi Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-light-100 rounded-lg border border-light-300">
          <div className="flex items-center gap-3">
            {system.wifiConnected ? (
              <Wifi className="text-primary" size={24} />
            ) : (
              <WifiOff className="text-red-600" size={24} />
            )}
            <div>
              <p className="text-sm text-gray-600">WiFi Status</p>
              <p className="text-gray-900 font-semibold">
                {system.wifiConnected ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>
          <Badge variant={system.wifiConnected ? "success" : "danger"}>
            {system.wifiConnected ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Signal Strength */}
        {system.wifiConnected && (
          <div className="flex items-center justify-between p-3 bg-light-100 rounded-lg border border-light-300">
            <div className="flex items-center gap-3">
              <Signal className={signal.color} size={24} />
              <div>
                <p className="text-sm text-gray-600">Signal Strength</p>
                <p className={`${signal.color} font-semibold`}>
                  {signal.label} ({system.rssi} dBm)
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full ${
                    i < signal.bars
                      ? signal.color.replace("text-", "bg-")
                      : "bg-light-300"
                  }`}
                  style={{ height: `${(i + 1) * 6}px` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Uptime */}
        <div className="flex items-center justify-between p-3 bg-light-100 rounded-lg border border-light-300">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600">System Uptime</p>
              <p className="text-gray-900 font-semibold font-mono">
                {formatUptime(system.uptime)}
              </p>
            </div>
          </div>
        </div>

        {/* Packet Loss */}
        <div className="flex items-center justify-between p-3 bg-light-100 rounded-lg border border-light-300">
          <div className="flex items-center gap-3">
            <AlertCircle
              className={
                system.packetLoss > 5 ? "text-red-600" : "text-green-600"
              }
              size={24}
            />
            <div>
              <p className="text-sm text-gray-600">Packet Loss</p>
              <p className="text-gray-900 font-semibold">
                {system.packetLoss.toFixed(1)}%
              </p>
            </div>
          </div>
          <Badge variant={system.packetLoss > 5 ? "danger" : "success"}>
            {system.packetLoss > 5 ? "High" : "Normal"}
          </Badge>
        </div>

        {/* ESP32 Info */}
        <div className="p-3 bg-gradient-to-br from-primary/10 to-transparent rounded-lg border border-primary/30">
          <p className="text-xs text-gray-600 mb-1">Device</p>
          <p className="text-gray-900 font-semibold">SohojPaat IoT Controller</p>
          <p className="text-xs text-primary mt-1">Firmware v1.0.0</p>
        </div>
      </div>
    </Card>
  );
};
