import { Grid } from "./grid.js";
import { Dijkstra } from "./dijkstra.js";

window.onload = function () {
    const header = document.getElementById('header');
    const btnDijkstra = document.getElementById("dijkstra");
    const btnReset = document.getElementById("reset");

    const height = window.innerHeight - header.offsetHeight - 2;
    const width = window.innerWidth - 2;

    const rows = Math.floor(height / 50);
    const cols = Math.floor(width / (height / rows));
    const start = [Math.floor(rows / 2) - 1, Math.floor(rows / 2)];
    const end = [Math.floor(rows / 2) - 1, cols - Math.floor(rows / 2) - 1];

    const grid = new Grid(height, width, rows, cols, start, end);

    const onStartChange = (newStart) => {
        const startIdx = newStart.split('-');

        grid.changeStart([Number(startIdx[0]), Number(startIdx[1])]);
    }

    const onEndChange = (newEnd) => {
        const endIdx = newEnd.split('-');

        grid.changeEnd([Number(endIdx[0]), Number(endIdx[1])]);
    }

    grid.registerStartChange(onStartChange);
    grid.registerEndChange(onEndChange);

    // grid.changeStart([8, 30]);
    // grid.changeEnd([8, 2]);

    btnDijkstra.addEventListener("click", () => {
        btnDijkstra.disabled = Dijkstra(grid);
    });

    btnReset.addEventListener("click", () => {
        grid.resetCellData();
    });
}