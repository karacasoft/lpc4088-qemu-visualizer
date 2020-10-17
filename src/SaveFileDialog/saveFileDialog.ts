import { remote } from 'electron';

export function showSaveDialog(file_contents: string, callback: () => void) {
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

    dialog.showSaveDialog(WIN, options).then((filename) => {
        // TODO write file
        console.log("wow file: " + filename);
    });
}



