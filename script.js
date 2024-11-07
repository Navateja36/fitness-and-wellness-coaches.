const chartCanvas = document.getElementById('workoutChart');
const ctx = chartCanvas.getContext('2d');
chartCanvas.width = 800;
chartCanvas.height = 600;

let blocks = [];
const sidebarBlocks = document.querySelectorAll('.block');
const clearBtn = document.getElementById('clearBtn');

// Listen for dragstart event to capture block info
sidebarBlocks.forEach(block => {
    block.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', block.getAttribute('data-distance'));
        e.dataTransfer.setData('split', block.getAttribute('data-split') || "1");
        e.dataTransfer.setData('name', block.textContent);
    });
});

// Allow drop on the chartCanvas
chartCanvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// Handle drop event and determine where to add the block (front, middle, or back)
chartCanvas.addEventListener('drop', (e) => {
    e.preventDefault();
    
    const distance = parseInt(e.dataTransfer.getData('text'));
    const split = parseInt(e.dataTransfer.getData('split'));
    const name = e.dataTransfer.getData('name');
    
    const mousePosX = e.offsetX; // Get the X position of the mouse
    addBlock(name, distance, split, mousePosX); // Add block at the position of the drop
    drawChart();
});

// Clear button logic
clearBtn.addEventListener('click', () => {
    blocks = [];
    chartCanvas.width = 800; // Reset canvas width
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
});

// Add block function
function addBlock(name, distance, split, mousePosX) {
    let insertIndex = 0; // Default to adding at the front

    // Find where the block should be inserted based on mousePosX
    let accumulatedWidth = 0;
    for (let i = 0; i < blocks.length; i++) {
        const barWidth = (chartCanvas.width / 10) * blocks[i].distance;
        accumulatedWidth += barWidth;
        
        // If the mousePosX is within this block's range, insert the new block after it
        if (mousePosX < accumulatedWidth) {
            insertIndex = i + 1; // Insert after the current block
            break;
        }
    }

    // Insert the new block at the calculated position
    blocks.splice(insertIndex, 0, { name, distance, split });

    // Resize the canvas based on the number of blocks added
    resizeCanvas();
}

// Resize the canvas width dynamically based on the number of blocks
function resizeCanvas() {
    let totalWidth = 0;

    // Calculate the total width of all blocks combined
    blocks.forEach(block => {
        const barWidth = (chartCanvas.width / 10) * block.distance;
        totalWidth += barWidth;
    });

    // Update the canvas width to accommodate all blocks
    chartCanvas.width = totalWidth + 50;  // Extra space for margins/padding
}

// Draw the blocks on the canvas
function drawChart() {
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    let x = 0;
    const y = chartCanvas.height - 0;
    let lastBlockType = '';  // Track the type of the last block

    blocks.forEach(block => {
        const barWidth = (chartCanvas.width / 10) * block.distance;
        const barHeight = chartCanvas.height / 2;
        const color = '#a29bfe';
        ctx.fillStyle = color;

        let lineWidth = 0;

        if (block.name !== lastBlockType && lastBlockType !== '') {
            lineWidth = 5;
        } else if (block.name === lastBlockType) {
            lineWidth = 2.5;
        }

        x += lineWidth;

        for (let i = 0; i < block.split; i++) {
            const sectionWidth = barWidth / block.split;
            ctx.fillRect(x, y - barHeight, sectionWidth, barHeight);
            x += sectionWidth;

            if (i < block.split - 1) {
                ctx.clearRect(x - 2, y - barHeight, 4, barHeight);
            }
        }

        lastBlockType = block.name;
    });
}
