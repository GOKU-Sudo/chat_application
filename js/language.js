const openChildLink = document.getElementById('cpp');
            let childWindow;

            openChildLink.addEventListener('click', (event) => {
                  event.preventDefault();
                  // Open the child page
                  childWindow = window.open(openChildLink.getAttribute('href'));
            });

            // Close the child page when the parent page is closed
            window.addEventListener('beforeunload', () => {
                  if (childWindow && !childWindow.closed) {
                        childWindow.close();
                  }
});
const openChildLink2 = document.getElementById('c');
            let childWindow2;

            openChildLink2.addEventListener('click', (event) => {
                  event.preventDefault();
                  // Open the child page
                  childWindow2 = window.open(openChildLink2.getAttribute('href'));
            });

            // Close the child page when the parent page is closed
            window.addEventListener('beforeunload', () => {
                  if (childWindow2 && !childWindow2.closed) {
                        childWindow2.close();
                  }
});
const openChildLink3 = document.getElementById('python');
            let childWindow3;

            openChildLink3.addEventListener('click', (event) => {
                  event.preventDefault();
                  // Open the child page
                  childWindow3 = window.open(openChildLink3.getAttribute('href'));
            });

            // Close the child page when the parent page is closed
            window.addEventListener('beforeunload', () => {
                  if (childWindow3 && !childWindow3.closed) {
                        childWindow3.close();
                  }
});