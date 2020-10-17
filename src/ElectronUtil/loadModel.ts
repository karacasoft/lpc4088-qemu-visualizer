import fs from 'fs';

import { remote } from 'electron';

export function loadModelFromFile(callback: (contents: string) => void) {
    const dialog = remote.dialog;
    
    const WIN = remote.getCurrentWindow();

    let options: Electron.OpenDialogOptions = {
        title: "Load Circuit",
        buttonLabel: "Load Circuit",
        properties: [
            "openFile"
        ],
        filters: [
            { name: "LPC4088 Visualizer Circuit File", extensions: [".lpc-vcf"] },
            { name: "All Files", extensions: [ "*" ] },
        ],
    };

    dialog.showOpenDialog(WIN, options).then((data) => {
        if(!data.canceled) {
            if(data.filePaths[0] !== undefined) {
                const circuit: string = fs.readFileSync(data.filePaths[0]).toString("utf8");
                callback(circuit);
            }
        }
    });
}