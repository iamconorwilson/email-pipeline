const url = 'https://files.actionrocket.dev/supercell/2025/connected_content/schema.json';

const response = await fetch(url);

const schema = await response.json();

console.log(schema);