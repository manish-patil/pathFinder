class CellData {
    constructor(r, c, top, left, height, width, color, blocked) {
        this.r = r;
        this.c = c;
        this.previous = null;
        this.distance = Infinity;

        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
        this.color = color || 'white';
        this.isBlockedCell = blocked || false;
        this.isStartCell = false;
        this.isEndCell = false;
        // this.selected = selected || false;
    }
}

export class Grid {
    constructor(height, width, rows, cols, start, end) {
        this.cells = {};

        this.gridHeight = height;
        this.gridWidth = width;
        this.gridRows = rows;
        this.gridCols = cols;
        this.start = start;
        this.end = end;

        this.drawGrid()
    }

    registerStartChange = (callback) => {
        this.startChangeCallback = callback;
    }

    registerEndChange = (callback) => {
        this.endChangeCallback = callback;
    }

    changeStart(newStart) {
        const oldStart = this.start;
        document.getElementById(this.getCellId(oldStart)).classList.remove('start');

        this.start = newStart;
        document.getElementById(this.getCellId(this.start)).classList.add('start');

        document.getElementById(this.getCellId(newStart)).appendChild(document.getElementById('start'));

        this.resetCellData();
    };

    changeEnd(newEnd) {
        const oldEnd = this.end;
        document.getElementById(this.getCellId(oldEnd)).classList.remove('end');

        this.end = newEnd;
        document.getElementById(this.getCellId(this.end)).classList.add('end');

        document.getElementById(this.getCellId(newEnd)).appendChild(document.getElementById('end'));

        this.resetCellData();
    };

    resetCellData() {
        let ctr = 1;

        for (let r = 0; r < this.gridRows; r++) {
            for (let c = 0; c < this.gridCols; c++) {
                const cellData = this.cells[`${r}-${c}`];

                if (r === this.start[0] && c === this.start[1]) {
                    cellData.distance = 0;
                    cellData.isStartCell = true;
                } else if (r === this.end[0] && c === this.end[1]) {
                    cellData.isEndCell = true;
                } else {
                    cellData.distance = Infinity;
                    cellData.isStartCell = false;
                    cellData.isEndCell = false;
                }

                setTimeout(() => {
                    document.getElementById(this.getCellId(r, c)).classList.remove('visited');
                    document.getElementById(this.getCellId(r, c)).classList.remove('path');
                }, 5 * ctr);
                ctr++;
            }
        }
    }

    drawGrid() {
        // Grid creation.
        const grid = document.getElementById('grid');
        // grid.style.position = 'relative'; // Parent Position

        // Cells creation.
        let top = 0;
        let left = 0;
        const cellHeight = this.gridHeight / this.gridRows;
        const cellWidth = this.gridWidth / this.gridCols;

        for (let r = 0; r < this.gridRows; r++) {
            for (let c = 0; c < this.gridCols; c++) {
                const cellData = new CellData(r, c, top, left, cellHeight, cellWidth, '#0089BA');

                if (r === this.start[0] && c === this.start[1]) {
                    cellData.distance = 0;
                    cellData.isStartCell = true;
                } else if (r === this.end[0] && c === this.end[1]) {
                    cellData.isEndCell = true;
                }
                this.cells[`${r}-${c}`] = cellData;

                const newCell = this.drawCell(cellData);

                grid.appendChild(newCell);

                left += cellWidth;
            }

            left = 0;
            top += cellHeight;
        }

        // document.getElementById(this.getCellId(this.start)).classList.add('start');
        // document.getElementById(this.getCellId(this.end)).classList.add('finish');
    }

    drawCell(cellData) {
        const rowStyle = {
            height: '50%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
        }

        const subCellStyle = (width) => ({
            height: '100%',
            width: width + '%',
            fontSize: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, Helvetica, sans-serif',
        });

        const imgStyle = {
            width: '50%',
            height: '50%',
            top: '25%',
            left: '25%',
            position: 'absolute'
        };

        const drag = (e) => {
            e.dataTransfer.setData('source', e.target.id);
        }

        const drop = (e) => {
            e.preventDefault();

            const target = e.target.id;
            const img = e.dataTransfer?.getData("source");

            if (img === 'start') {
                this.startChangeCallback(target);
            } else if (img === 'end') {
                this.endChangeCallback(target);
            }
        }

        const dragOver = (e) => {
            e.preventDefault();
        }

        let cell = document.getElementById(`${cellData.r}-${cellData.c}`);
        if (!cell) {
            cell = document.createElement('div');
            cell.id = this.getCellId(cellData.r, cellData.c);
        } else {
            while (cell.firstChild) { // remove all children, to be add again.
                cell.removeChild(cell.firstChild);
            }
        }
        // cell.classList.add('visited');

        cell.addEventListener("drop", drop);
        cell.addEventListener("dragover", dragOver);

        cell.style.top = cellData.top + 'px';
        cell.style.left = cellData.left + 'px';
        cell.style.height = cellData.height + 'px';
        cell.style.width = cellData.width + 'px';
        cell.style.position = 'absolute'; // Cell Position
        cell.style.border = '0.5px solid DodgerBlue';
        cell.style.display = 'flex';
        cell.style.flexDirection = 'column';
        cell.style.backgroundColor = cellData.blocked ? 'black' : cellData.color;

        const row1 = document.createElement('div');
        Object.assign(row1.style, rowStyle);

        const row2 = document.createElement('div');
        Object.assign(row2.style, rowStyle);

        const subCell1 = document.createElement('div'); // Current cell
        subCell1.innerText = `${cellData.r}-${cellData.c}`
        Object.assign(subCell1.style, subCellStyle(50));

        const subCell2 = document.createElement('div'); // Current previous
        subCell2.innerText = cellData.previous ? `${cellData.previous[0]}-${cellData.previous[1]}` : '-';
        Object.assign(subCell2.style, subCellStyle(50));

        const subCell3 = document.createElement('div'); // Distance
        subCell3.innerText = cellData.distance;
        Object.assign(subCell3.style, subCellStyle(100));

        row1.appendChild(subCell1);
        row1.appendChild(subCell2);
        row2.appendChild(subCell3);

        // cell.appendChild(row1);
        // cell.appendChild(row2);

        if (cellData.isStartCell) {
            const img = document.createElement('img');
            img.id = "start";

            // img.src = '../images/play-button.png';
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAJFAAACRQGs5fN8AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAJBQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUIf2wAAAC90Uk5TAAMKDBAbHygvMDU8QEhKTE5QYmNkaHB0h4qMjpOWpKewtr7Ay9XY5efq8vP4+f6s7ZJDAAABe0lEQVRYw62X2VaDMBCGf4rUpVawsogoLWsFgXn/t/Oi6mltEiad/rfJfOdMMiugkRvEaV62fd+WeRoHLqzkRcVAJxqKyONaL5J6IoWmOlkwzJ1wT1rtQ2fO3m/IqMY3mi8rmlW11NuvOmKoW+nsNyOxNG7Ur5cRW5niLZ0dWWh3TsjIStmZ/2Spf++wGm0B48lfLDuyVnccDxVdoOoofuki/UW101wGaH7/MlQeTx8v/nYyEsKf/Ffm79czADx8mgD7Q31IlIdvB/qtkZAAAGrl2SMYhBoAPLWfN2AQJg9ARGaAkRABKOYAJkIBuMMswEAYXAQ0DzAQAsQcgJ4QI2UBtIQUOQ+gI+QomQDcK2tOiZYLUDvbomcD1qprvRwgdkH8iOJvFAeSOJTFySROZ3FBkZc0cVEVl3V5YzG1tjtOa9M11/en9evIaa7y9i4eMOQjjnzIEo958kFTPurKh23xuC9fOK6w8siXLvnad4XFU776XmH5tlv/vwH54wah77IAgAAAAABJRU5ErkJggg==';
            img.draggable = true;

            Object.assign(img.style, imgStyle);
            img.addEventListener("dragstart", drag);

            cell.classList.add('start');
            cell.appendChild(img);
        } else if (cellData.isEndCell) {
            const img = document.createElement('img');
            img.id = "end";

            // img.src = '../images/finish.png';
            img.src = 'data:image/png;base64,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';
            img.draggable = true;

            Object.assign(img.style, imgStyle);
            img.addEventListener("dragstart", drag);

            cell.classList.add('end');
            cell.appendChild(img);
        }

        return cell;
    }

    getCellId = (...params) => {
        if (Array.isArray(params[0])) {
            return `${params[0][0]}-${params[0][1]}`
        } else {
            return `${params[0]}-${params[1]}`
        }
    };

    isValidCell = (r, c) => {
        return (r >= 0 && r <= this.gridRows - 1 && c >= 0 && c <= this.gridCols - 1)
    }
}