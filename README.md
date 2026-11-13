# Week 7: Advanced JavaScript – Practical Applications & Code Quality

## Author

- **Name:** Stacy Otieno
- **GitHub:** [@Stacy-JOtieno](https://github.com/Stacy-JOtieno)
- **Date:** November 13, 2026

## Project Description

Week 7 focused on strengthening my JavaScript development skills through practical exercises involving browser storage, DOM manipulation, asynchronous programming, form handling, code refactoring and code reviews.

Throughout the week, I worked on building interactive web applications, implementing data persistence using LocalStorage, handling user input, improving code readability and applying professional software development practices.

The main objective was to understand how to write JavaScript that is not only functional but also reusable, maintainable and reliable.

## Technologies Used

- HTML5 – Structuring web pages and forms.
- CSS3 – Styling and responsive layouts.
- JavaScript (ES6+) – Application functionality and interactivity.
- DOM Manipulation – Dynamically updating webpage content.
- LocalStorage API – Persisting user preferences, search history and form data.
- JSON – Converting JavaScript objects into storable data.
- Fetch API – Making HTTP requests.
- Async/Await – Managing asynchronous operations.
- Promises – Handling asynchronous JavaScript operations.
- Try/Catch – Error handling.
- Git – Version control.
- GitHub – Repository management and collaboration.
- VS Code – Code editing and development.

## Features and Weekly Activities

### Day 1: Theme Persistence

Developed a theme toggle that allows users to switch between light and dark modes.

Features:
- Switch between light and dark themes.
- Save theme preferences using LocalStorage.
- Automatically restore the selected theme when the page reloads.

### Day 2: Recent Searches

Developed a search history feature that remembers users' previous searches.

Features:
- Search input for entering search terms.
- Save recent searches using LocalStorage.
- Display the five most recent searches.
- Remove duplicate searches.
- Select previous searches from the history dropdown.
- Maintain search history after refreshing the page.

### Day 3: Form Auto-Save

Developed an automatic form-saving system to prevent users from losing information.

Features:
- Automatically save form fields every five seconds.
- Recover previously saved information after refreshing the page.
- Save form information using LocalStorage.
- Clear saved information after successful form submission.
- Provide feedback when information is saved or recovered.

### Day 4: Code Refactoring

Practised improving existing JavaScript code without changing its intended functionality.

Activities:
- Improved variable and function naming.
- Extracted repeated code into reusable functions.
- Added appropriate error handling.
- Reduced unnecessary code repetition.
- Improved code readability and organization.
- Added meaningful comments where necessary.

### Day 5: Weather Dashboard Code Review

Reviewed the Weather Dashboard to evaluate its code quality, organization and error handling.

Areas reviewed:
- Handling invalid city searches.
- API request failures and network errors.
- Loading indicators and user feedback.
- Code organization and readability.
- Reusability of functions.
- API response validation.
- Security and API key management.
- Areas requiring further testing and improvement.

## How to Run

1. Clone this repository:

   `git clone YOUR_REPOSITORY_URL`

2. Navigate into the project directory:

   `cd YOUR_PROJECT_FOLDER`

3. Open the individual project folders in VS Code.

4. Open the respective `index.html` files in your browser.

5. For the Weather Dashboard, configure the required API credentials before running the application.

## Lessons Learned

During Week 7, I developed a deeper understanding of practical JavaScript development.

Some of the major lessons included:

- Understanding how LocalStorage works and how to persist information in the browser.
- Using JSON.stringify() and JSON.parse() to store and retrieve JavaScript objects.
- Working with arrays and methods such as filter(), unshift() and slice().
- Using setInterval() to perform repeated operations.
- Understanding DOM manipulation and event listeners.
- Working with asynchronous JavaScript using promises and async/await.
- Implementing error handling using try/catch.
- Writing reusable functions and avoiding code duplication.
- Understanding the importance of clean code and meaningful naming conventions.
- Reviewing code and identifying areas for improvement.
- Understanding how to make applications more maintainable and reliable.

## Challenges Faced

1. **Data Persistence:** Ensuring that information remained available after refreshing the browser. I addressed this by implementing LocalStorage.

2. **Managing Search History:** Preventing duplicate searches and limiting the history to five entries. I used array methods such as filter(), unshift() and slice().

3. **Automatic Form Saving:** Implementing a five-second saving interval while ensuring previously entered information could be recovered correctly.

4. **Error Handling:** Understanding how to catch errors and provide meaningful feedback instead of allowing applications to fail silently.

5. **Code Refactoring:** Identifying unnecessary repetition and restructuring code into smaller, reusable functions.

6. **Code Review:** Identifying weaknesses in the Weather Dashboard and documenting improvements needed in validation, error handling, organization and maintainability.

## Collaboration
- **Partner:** [@Belinda-May](https://github.com/Belinda-May)
- **Partner's GitHub:** https://github.com/Belinda-May

## Live Demo

[View Live Demo](https://stacy-jotieno.github.io/iyf-s12-week-07-Stacy-JOtieno/)

