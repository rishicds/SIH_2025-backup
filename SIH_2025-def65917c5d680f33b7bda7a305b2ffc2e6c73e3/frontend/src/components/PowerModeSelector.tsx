"use client";

import { useState } from "react";
import { Card, Button } from "./UI";
import { Zap, Leaf, Gauge, Play, Square } from "lucide-react";
import { motorService } from "@/services/api";
import useStore from "@/store/useStore";
import { toast } from "sonner";

type PowerMode = "eco" | "normal" | "power";

interface ModeConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  motorASpeed: number;
  motorBSpeed: number;
  description: string;
}

const MODES: Record<PowerMode, ModeConfig> = {
  eco: {
    name: "Eco Mode",
    icon: <Leaf size={20} />,
    color: "text-green-400",
    bgColor: "bg-green-500/20 border-green-500",
    motorASpeed: 70,
    motorBSpeed: 70,
    description: "Energy efficient • Lower power consumption",
  },
  normal: {
    name: "Normal Mode",
    icon: <Gauge size={20} />,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20 border-blue-500",
    motorASpeed: 75,
    motorBSpeed: 75,
    description: "Balanced performance • Recommended",
  },
  power: {
    name: "Power Mode",
    icon: <Zap size={20} />,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20 border-yellow-500",
    motorASpeed: 85,
    motorBSpeed: 85,
    description: "Maximum performance • High speed",
  },
};

export const PowerModeSelector = () => {
  const [currentMode, setCurrentMode] = useState<PowerMode>("normal");
  const [isSwitching, setIsSwitching] = useState(false);
  const motorA = useStore((state) => state.motorA);
  const motorB = useStore((state) => state.motorB);
  const updateMotorA = useStore((state) => state.updateMotorA);
  const updateMotorB = useStore((state) => state.updateMotorB);
  const addLog = useStore((state) => state.addLog);

  const handleModeChange = async (mode: PowerMode) => {
    if (mode === currentMode || isSwitching) return;

    setIsSwitching(true);
    const config = MODES[mode];
    const bothMotorsOn = motorA.isOn && motorB.isOn;

    try {
      toast.info(`Switching to ${config.name}...`);

      // Change speeds directly without stopping motors
      addLog({
        motor: "System",
        event: `Mode Switch: Setting speeds to ${config.motorASpeed}%`,
        voltage: 0,
      });

      await Promise.all([
        motorService.setSpeed("a", config.motorASpeed),
        motorService.setSpeed("b", config.motorBSpeed),
      ]);

      updateMotorA({ speed: config.motorASpeed });
      updateMotorB({ speed: config.motorBSpeed });

      // If motors were off, start them
      if (!bothMotorsOn) {
        await new Promise((resolve) => setTimeout(resolve, 200));

        addLog({
          motor: "System",
          event: "Mode Switch: Starting motors",
          voltage: 0,
        });

        await Promise.all([motorService.start("a"), motorService.start("b")]);

        updateMotorA({ isOn: true, status: "running" });
        updateMotorB({ isOn: true, status: "running" });
      }

      setCurrentMode(mode);
      toast.success(`${config.name} activated!`);

      addLog({
        motor: "System",
        event: `${config.name} activated`,
        voltage: 0,
      });
    } catch (error) {
      console.error("Failed to switch mode:", error);
      toast.error("Failed to switch mode");
    } finally {
      setIsSwitching(false);
    }
  };

  const handleStartBoth = async () => {
    if (isSwitching) return;

    setIsSwitching(true);
    try {
      toast.info("Starting both motors...");

      await Promise.all([motorService.start("a"), motorService.start("b")]);

      updateMotorA({ isOn: true, status: "running" });
      updateMotorB({ isOn: true, status: "running" });

      toast.success("Both motors started!");
      addLog({
        motor: "System",
        event: "Both motors started",
        voltage: 0,
      });
    } catch (error) {
      console.error("Failed to start motors:", error);
      toast.error("Failed to start motors");
    } finally {
      setIsSwitching(false);
    }
  };

  const handleStopBoth = async () => {
    if (isSwitching) return;

    setIsSwitching(true);
    try {
      toast.info("Stopping both motors...");

      await Promise.all([motorService.stop("a"), motorService.stop("b")]);

      updateMotorA({ isOn: false, status: "stopped" });
      updateMotorB({ isOn: false, status: "stopped" });

      toast.success("Both motors stopped!");
      addLog({
        motor: "System",
        event: "Both motors stopped",
        voltage: 0,
      });
    } catch (error) {
      console.error("Failed to stop motors:", error);
      toast.error("Failed to stop motors");
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Power Mode</h3>
          <p className="text-sm text-gray-600">
            Select operating mode for both motors
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartBoth}
            disabled={isSwitching || (motorA.isOn && motorB.isOn)}
            className="flex items-center gap-2"
          >
            <Play size={16} />
            Start Both
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleStopBoth}
            disabled={isSwitching || (!motorA.isOn && !motorB.isOn)}
            className="flex items-center gap-2"
          >
            <Square size={16} />
            Stop Both
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(Object.keys(MODES) as PowerMode[]).map((mode) => {
          const config = MODES[mode];
          const isActive = currentMode === mode;

          return (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              disabled={isSwitching}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300
                ${
                  isActive
                    ? config.bgColor
                    : "bg-light-100 border-light-300 hover:border-light-400"
                }
                ${
                  isSwitching
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
                disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={config.color}>{config.icon}</div>
                <span className="font-semibold text-gray-900">{config.name}</span>
                {isActive && (
                  <span className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 text-left">
                {config.description}
              </p>
              <div className="mt-3 pt-3 border-t border-light-300">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Motor A:</span>
                  <span className={isActive ? config.color : "text-gray-600"}>
                    {config.motorASpeed}%
                  </span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-600">Motor B:</span>
                  <span className={isActive ? config.color : "text-gray-600"}>
                    {config.motorBSpeed}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isSwitching && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-primary">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Switching mode...</span>
          </div>
        </div>
      )}
    </Card>
  );
};
