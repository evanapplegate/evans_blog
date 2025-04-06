document.addEventListener('DOMContentLoaded', async () => {
  // List of posts (will be auto-generated or manually updated)
  const posts = [
    { title: 'ML has killed "looks okay from arm\'s length" cartography', file: 'posts/ML_killed_carto.md' },
    { title: 'When Danielle Baskin took a romanesco broccoli to the 3D printing conf...', file: 'posts/baskin.md' },
    { title: 'The Soft End of Something Sharp', file: 'posts/bedside_nursing.md' },
    { title: 'The Best Maps Lie Ahead', file: 'posts/best_maps_lie_ahead.md' },
    { title: 'Get Me Some Computer Rurality', file: 'posts/computer_rurality.md' },
    { title: '"COVID Response" Was Hands-Down The Craziest Thing That Had Happened In My Life', file: 'posts/covid.md' },
    { title: 'My least favorite ten thousand words', file: 'posts/evans_thesis_notes.md' },
    { title: 'Have you heard about our painfully loud speaker as a service?', file: 'posts/genasys.md' },
    { title: 'Cartographic Graduate Education at the University of Wisconsin–Madison, 2014–2017', file: 'posts/grad_school.md' },
    { title: '365 Days of Great Ideas for Your Map Business', file: 'posts/great_map_ideas.md' },
    { title: 'Image Example Post', file: 'posts/image_example.md' },
    { title: 'What I\'ve Learned During 13 Years of Mapmaking', file: 'posts/map_tips.md' },
    { title: 'The Mapmaker\'s Terrible Hand', file: 'posts/mapmakers_terrible_hand.md' },
    { title: 'More men makes eldercare easier', file: 'posts/men_eldercare.md' },
    { title: '2060: 62 Million Old, Lonely, Broke Millennials', file: 'posts/millenials_old.md' },
    { title: 'Podcasting Tips', file: 'posts/podcast_tips.md' },
    { title: 'Shoutout machine learning', file: 'posts/shoutout_ML.md' },
    { title: 'The American Hospital: Trying to Heal in Someone\'s Workplace', file: 'posts/trying_to_heal_in_a_workplace.md' }
  ];
  
  // Track current post index
  let currentPostIndex = 0;
  
  // Populate sidebar navigation
  const postList = document.getElementById('post-list');
  posts.forEach(post => {
    const listItem = document.createElement('li');
    listItem.style.listStyleType = 'none';
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = post.title;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      loadPost(post.file);
    });
    listItem.appendChild(link);
    postList.appendChild(listItem);
  });
  
  // Set up navigation buttons
  const prevButton = document.getElementById('prev-post');
  const nextButton = document.getElementById('next-post');
  
  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPostIndex > 0) {
      loadPost(posts[currentPostIndex - 1].file);
    }
  });
  
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPostIndex < posts.length - 1) {
      loadPost(posts[currentPostIndex + 1].file);
    }
  });
  
  // Update navigation buttons based on current post
  function updateNavigation() {
    prevButton.style.visibility = currentPostIndex > 0 ? 'visible' : 'hidden';
    nextButton.style.visibility = currentPostIndex < posts.length - 1 ? 'visible' : 'hidden';
  }

  // Load a post
  async function loadPost(file) {
    try {
      // Scroll to top of the page when loading a new post
      window.scrollTo(0, 0);
      
      const response = await fetch(file);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const markdown = await response.text();
      
      // Convert markdown to HTML
      const html = marked.parse(markdown);
      document.getElementById('post-content').innerHTML = html;
      
      // Update URL hash
      window.location.hash = file;
      
      // Handle images
      document.querySelectorAll('#post-content img').forEach(img => {
        if (!img.src.startsWith('http')) {
          const postDir = file.substring(0, file.lastIndexOf('/'));
          img.src = `${postDir}/${img.getAttribute('src')}`;
        }
      });
      
      // Update current post index
      currentPostIndex = posts.findIndex(post => post.file === file);
      updateNavigation();
    } catch (error) {
      console.error('Error loading post:', error);
      document.getElementById('post-content').innerHTML = `<h1>Error</h1><p>Failed to load post: ${error.message}</p>`;
    }
  }
  
  // Load post from URL hash on page load
  if (window.location.hash) {
    const postFile = window.location.hash.substring(1);
    loadPost(postFile);
  } else if (posts.length > 0) {
    // Load the first post by default
    loadPost(posts[0].file);
  }
});