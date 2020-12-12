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
        let rows, cols, count;
        
        data.forEach((item, i) => {
            if (i !== 0) {
                if (item.length == data[i - 1].length) {
                    count = item.length
                }
            }
        })

        rows = data.length;
        cols = count;

        setInterval(() => {
            grid = updateGrid(grid);
            console.log(grid)
        }, 1000)
        // const cols = 5;
        // const rows = 5;

        function createCells() {
            const arr = new Array;
            for (let i = 0; i < cols; i++) {
                arr.push(new Array);
                for (let j = 0; j < rows; j++) {
                    arr[i].push(Math.floor(Math.random() * 2));
                }
            }
            return arr
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
    });