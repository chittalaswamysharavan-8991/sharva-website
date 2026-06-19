import React from "react";
import { Download } from "lucide-react";

export default function InstallPanel() {
  return (
    <article className="panel install-panel tone-red">
      <div className="panel-title">
        <Download size={18} />
        <h3>iPhone Daily Use</h3>
      </div>
      <p>
        After deployment, open the live URL in Safari, tap Share, then Add to Home Screen. It will launch as Pablo
        Cockpit.
      </p>
    </article>
  );
}
