"use client";

import { useState } from "react";

import {
  Grid,
  Type,
  Upload,
  Settings,
  Pencil,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";

import TextPanel from "./panels/text";
import ElementsPanel from "./panels/elements";
import UploadPanel from "./panels/upload";
import SettingsPanel from "./panels/settings";
import AIPanel from "./panels/ai";
import Draw from "./panels/draw";
import DrawPanel from "./panels/draw";

function Sidebar() {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);

  const sidebarItems = [
    {
      id: "elements",
      icon: <Grid />,
      label: "Elements",
      panel: () => <ElementsPanel />,
    },
    {
      id: "text",
      icon: <Type />,
      label: "Text",
      panel: () => <TextPanel />,
    },
    {
      id: "upload",
      icon: <Upload />,
      label: "Upload",
      panel: () => <UploadPanel />,
    },
    {
      id: "settings",
      icon: <Settings />,
      label: "Settings",
      panel: () => <SettingsPanel />,
    },
    {
      id: "ai",
      icon: <Sparkles />,
      label: "AI",
      panel: () => <AIPanel />,
    },
    {
      id: "draw",
      icon: <Pencil />,
      label: "Draw",
      panel: () => <DrawPanel />,
    },
  ];

  const activeItem = sidebarItems.find((item) => item.id === activeSidebar);

  const handleSidebarClick = (id: string) => {
    if (id === activeSidebar && !isPanelCollapsed) return;
    setActiveSidebar(id);
    setIsPanelCollapsed(false);
  };

  const closeSecondaryPanel = () => {
    setActiveSidebar(null);
    setIsPanelCollapsed(true);
  };

  const togglePanelCollapse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  return (
    <div className="flex h-full">
      <aside className="sidebar ">
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSidebarClick(item.id)}
            className={`sidebar-item ${
              activeSidebar === item.id ? "active" : ""
            }`}
          >
            <div className="sidebar-item-icon w-5 h-5">{item.icon}</div>
            <span className="sidebar-item-label">{item.label}</span>
          </div>
        ))}
      </aside>
      {/* SECONDARY PANEL */}
      {activeSidebar && (
        <div
          className={`secondary-panel ${isPanelCollapsed ? "collapsed" : ""}`}
          style={{
            width: isPanelCollapsed ? "0px" : "320px",
            opacity: isPanelCollapsed ? 0 : 1,
            overflow: isPanelCollapsed ? "hidden" : "visible",
          }}
        >
          <div className="panel-header">
            <button className="back-button" onClick={closeSecondaryPanel}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="panel-title">{activeItem?.label}</span>
          </div>
          <div className="panel-content">{activeItem?.panel()}</div>
          <button className="collapse-button" onClick={togglePanelCollapse}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
