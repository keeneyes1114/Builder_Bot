const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Path to your dummy file
const dummyFile = path.join(__dirname, "dummy_file.txt");

// Start and end date for the contribution simulation
const startDate = new Date("2021-1-15");
const endDate = new Date("2021-12-16");

// Helper function to format dates in YYYY-MM-DD format
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Function to simulate a commit on a given date
function simulateCommit(date, commitIndex) {
  try {
    // Modify the dummy file with the commit index to simulate different commits per day
    fs.writeFileSync(dummyFile, `Commit ${commitIndex} on ${formatDate(date)}`);

    // Stage the dummy file
    execSync(`git add ${dummyFile}`);

    // Commit with the specific date and commit index
    execSync(
      `git commit --date="${date.toISOString()}" -m "Commit ${commitIndex} on ${formatDate(date)}"`
    );

    console.log(`Commit ${commitIndex} for ${formatDate(date)} created.`);
  } catch (err) {
    console.error("Error during commit:", err.message);
  }
}

// Function to simulate between 0 and 10 commits per day
function simulateDailyCommits(date, count) {
  // Decide how many commits to make today (random number between 0 and 10)
  const commitsToday = Math.floor(Math.random() * (count + 1)); // 0 to 10 commits

  // If we have commits to make today, proceed with the commits
  if (commitsToday > 0) {
    console.log(`Making ${commitsToday} commits on ${formatDate(date)}...`);
    for (let i = 1; i <= commitsToday; i++) {
      simulateCommit(date, i); // Simulate each commit for today
    }
  } else {
    console.log(`No commits on ${formatDate(date)} (completely gray).`);
  }
}

// Main simulation function
function simulateContributions() {
  let currentDate = startDate;
  let count = 13;

  // Loop through each date in the range
  while (currentDate <= endDate) {
    // Optionally, you can skip some days (e.g., Sundays or Mondays)
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    const randomDay = Math.floor(Math.random() * 6 + 1); // 0 to 10 commits

    if (dayOfWeek === 0 || dayOfWeek === 1 || (dayOfWeek <= randomDay + 1 && dayOfWeek >= randomDay - 1)) {
      count = 1;
    } else {
      count = 13;
    } 
    
    // Simulate commits for active days
    simulateDailyCommits(currentDate, count);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// Start the commit simulation
simulateContributions();

// After all commits are made, push to GitHub
try {
  execSync("git push origin main", { stdio: "inherit" });
  console.log("Changes pushed to GitHub.");
} catch (err) {
  console.error("Error during push:", err.message);
}
