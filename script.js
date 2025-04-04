// Make sure script is loaded.
console.log("script loaded");

let abortController = new AbortController();
let requestInFlight = undefined;

function main() {

    const input = document.getElementById("input");
    const output = document.getElementById("output");

    input.addEventListener("change", async () => {

        // Abort previous request if still in flight
        if (requestInFlight) {
            console.log("aborting...");
            abortController.abort();
        }

        // Create abort controller for the new request
        abortController = new AbortController();

        const query = input.value;
        output.textContent = "sending request";

        requestInFlight = testFetch(query, abortController.signal);

        try {
            const response = await requestInFlight;
            output.textContent = response.message;
        } catch (error) {
            if (error.name === "AbortError") {
                output.textContent = "request aborted";
            } else {
                output.textContent = "error" + error.message
            }
        } finally {
            requestInFlight = undefined;
        }
    });
}


function testFetch(query, signal) {
    return new Promise((resolve, reject) => {
        const delay = setTimeout(() => {
            resolve({ message: `test, test "${query}"` });
        }, 9000); // 9 Second Delay

        // Listen for the abort signal
        signal.addEventListener("abort", () => {
            clearTimeout(delay); // cancel the request
            reject(new DOMException("Request aborted", "AbortError"));
        });
    });
}

document.addEventListener("DOMContentLoaded", main);
