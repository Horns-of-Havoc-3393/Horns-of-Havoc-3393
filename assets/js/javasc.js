const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // set true/false on element
    entry.target.isVisible = entry.isIntersecting;

    // handle visibility directly here
    if (entry.target.classList.contains('Who')) {
      const description = document.querySelector('#who-description');
      const img = document.querySelector('#who-img');
      if (entry.isIntersecting) {
        description.classList.add("visible");
        img.classList.add("visible");
      } else {
        description.classList.remove("visible");
        img.classList.remove("visible");
      }
    }

    if (entry.target.classList.contains('What')) {
      const img = document.querySelector('#what-img');
        const description = document.querySelector('#what-description');
      if (entry.isIntersecting) {
        img.classList.add("visible");
        description.classList.add("visible");
      } else {
        img.classList.remove("visible");
        description.classList.remove("visible");
      }
    }
  });
}, { threshold: 0.75 });

// start observing all targets
document.querySelectorAll('.Who, .What').forEach(el => observer.observe(el));
