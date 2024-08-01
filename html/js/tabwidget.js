document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            // Add active class to clicked tab
            this.classList.add("active");

            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove("active"));
            // Show the corresponding tab pane
            const activePane = document.getElementById(this.dataset.tab);
            activePane.classList.add("active");
        });
    });
});
