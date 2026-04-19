import fetch from 'node-fetch';

const prompt = encodeURIComponent("a man standing near a mountain, 4k resolution, cinematic lighting, highly detailed, masterfully crafted");
const url = `https://pollinations.ai/p/${prompt}?width=1024&height=1024&nologo=true&seed=12345`;

console.log(`Checking URL: ${url}`);

async function test() {
  try {
    const response = await fetch(url);
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    if (response.ok) {
      console.log("SUCCESS: Image API is responding correctly.");
    } else {
      console.log("FAILURE: Image API returned an error.");
    }
  } catch (err) {
    console.error("ERROR: Failed to connect to Pollinations AI.", err.message);
  }
}

test();
