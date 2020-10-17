import fs from 'fs';

import { remote } from 'electron';

export function showSaveDialog(file_contents: string, callback: () => void) {
    //console.log(electron);
    //console.log(remote);

    const dialog = remote.dialog;
    
    const WIN = remote.getCurrentWindow();

    let options: Electron.SaveDialogOptions = {
        title: "Save Circuit",
        buttonLabel: "Save Circuit",
        filters: [
            { name: "LPC4088 Visualizer Circuit File", extensions: [".lpc-vcf"] },
            { name: "All Files", extensions: [ "*" ] },
        ],
    };

    dialog.showSaveDialog(WIN, options).then((filedata) => {
        if(!filedata.canceled && filedata.filePath) {
            const extension = filedata.filePath.endsWith(".lpc-vcf") ?
                "" : ".lpc-vcf";

            fs.writeFileSync(filedata.filePath + extension, file_contents);
        }
    });
}



