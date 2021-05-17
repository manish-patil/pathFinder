class PriorityQueue {
    constructor(vertex, weight) {
        this.queue = [{ vertex, weight }];
    }

    Enqueue = (vertex, weight) => {
        this.queue.push({ vertex, weight });
        this.queue.sort((a, b) => a.weight - b.weight)
    }

    Dequeue = () => {
        return this.queue.shift().vertex;
    }

    Empty = () => {
        this.queue = [];
    }
}

export function Dijkstra(grid) {
    const visited = [];
    let idx = 0;

    const start = grid.start;
    const end = grid.end;

    const queue = new PriorityQueue(start, 0);

    while (queue.queue.length > 0) {
        const current = queue.Dequeue();

        if (current[0] == end[0] && current[1] == end[1]) {
            queue.Empty();
            drawPath(start, end, idx);
        } else {
            const r = current[0];
            const c = current[1];

            const neighbours = [
                // [r - 1, c - 1], // top-left
                [r - 1, c], // top
                // [r - 1, c + 1], // top-right
                [r, c + 1], // right
                // [r + 1, c + 1], // bottom-right
                [r + 1, c], // bottom
                // [r + 1, c - 1], // bottom-left
                [r, c - 1] // left
            ];

            for (let i = 0; i < neighbours.length; i++) {
                const neighbour = neighbours[i];

                if (grid.isValidCell(neighbour[0], neighbour[1])) {
                    if (!visited.includes(grid.getCellId(neighbour))) {
                        if (grid.cells[grid.getCellId(neighbour)].distance > grid.cells[grid.getCellId(current)].distance + 1) {

                            grid.cells[grid.getCellId(neighbour)] = {
                                ...grid.cells[grid.getCellId(neighbour)],
                                distance: grid.cells[grid.getCellId(current)].distance + 1,
                                previous: current,
                            };

                            grid.drawCell(grid.cells[grid.getCellId(neighbour)]);

                            setTimeout((neighbour) => {
                                document.getElementById(grid.getCellId(neighbour)).classList.add('visited');
                            }, 20 * idx, neighbour);

                            visited.push(grid.getCellId(neighbour));

                            queue.Enqueue(neighbour, grid.cells[grid.getCellId(current)].distance + 1);
                            idx++;
                        }
                    }

                    if (neighbour[0] === end[0] && neighbour[1] === end[1]) {
                        queue.Empty();
                        drawPath(grid, start, end, idx);
                        break;
                    }
                }
            };
        }
    }
}

function drawPath(grid, start, end, idx) {
    let pathFound = false;
    let vertex = grid.cells[grid.getCellId(end)];
    const path = [vertex];

    while (!pathFound) {
        if (vertex[0] == start[0] && vertex[1] == start[1]) {
            pathFound = true;
        }

        const previous = grid.cells[grid.getCellId(vertex.r, vertex.c)].previous;
        if (previous) {
            vertex = grid.cells[grid.getCellId(previous)];
            path.push(vertex);
        } else {
            pathFound = true;
        }
    }

    while (path.length) {
        const next = path.pop();

        setTimeout((next) => {
            document.getElementById(grid.getCellId(next.r, next.c)).classList.remove(['visited']);
            document.getElementById(grid.getCellId(next.r, next.c))?.classList?.add('path');
        }, 20 * idx, next);

        idx++;
    }
}