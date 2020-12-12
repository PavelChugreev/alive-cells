const getStartCondition = async (url) => {
    const result = await fetch(url);
    if (!result.ok) {
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }
    return await result.json();
};

let data;
getStartCondition("http://localhost:3000/startCondition")
    .then(res => data = res)
    .then(() => {

        const field = document.querySelector('canvas');
        const ctx = field.getContext('2d');

        // const cellSize = 10;
        field.width = 600;
        field.height = 600;

        let cellSize = field.width / data.length;

        const rows = field.height / cellSize;
        const cols = field.width / cellSize;

        function createCells() {
            const rowsArr = new Array;
            for (let i = 0; i < rows; i++) {
                rowsArr.push(new Array);
                for (let j = 0; j < cols; j++) {
                    // rowsArr[i].push(Math.floor(Math.random() * 2));
                    rowsArr[i].push(data[i][j]);
                }
            }
            return rowsArr
        }

        let grid = createCells();

        function updateGrid(grid) {
            const newGrid = grid.map(arr => [...arr]);

            for (let col = 0; col < grid.length; col++) {
                for (let row = 0; row < grid[col].length; row++) {
                    const cell = grid[col][row];
                    let neighbours = 0;

                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            if (i === 0 && j === 0) {
                                continue;
                            }

                            const cellRow = row + j;
                            const cellCol = col + i;
                            if (cellRow >= 0 && cellCol >= 0 && cellCol < cols && cellRow < rows) {
                                const currentNeighbour = grid[col + i][row + j];
                                neighbours += currentNeighbour;
                            }
                        }
                    }

                    if (cell === 1) {
                        if (neighbours < 2 || neighbours > 3) {
                            newGrid[col][row] = 0;
                        }
                    } else if (cell === 0 && neighbours === 3) {
                        newGrid[col][row] = 1;
                    }
                }
            }
            return newGrid;
        }

        function render(grid) {
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].length; j++) {
                    const cell = grid[i][j];

                    ctx.beginPath();
                    ctx.rect(i * cellSize, j * cellSize, cellSize, cellSize);
                    ctx.fillStyle = cell ? 'black' : 'white';
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        setInterval(() => {
            grid = updateGrid(grid);
            render(grid);
            console.log(grid)
        }, 2000)

    })

