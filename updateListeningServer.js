const express = require("express")


const app = express()

app.get("/newReleasedVersionAvailable", (req, res) => {

    console.log("new release available");

    const command = "git pull";
    executeCMD(command);

    res.status(200).json({ status: "ok" });
})


const { exec } = require("child_process");

// Replace 'ls' with your desired Linux command
function executeCMD(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Error in command execution: ${stderr}`);
            return;
        }

        console.log(`Command output:\n${stdout}`);
    });
}



app.listen(12000, (res) => {
    console.log("updateListener server is running on port ", 12000);
})