// Atirath Holdings - CMS Content Loader
// This file dynamically loads content from Decap CMS (markdown files)

const AtirathCMS = (function() {
    // Configuration
    const CONFIG = {
        blogPath: '/src/blog/',
        careersPath: '/src/careers/',
        galleryPath: '/src/gallery/',
        pressPath: '/src/press/',
        teamPath: '/src/team/',
        // Fallback data when CMS is not available
        fallback: {
            blog: [
                { title: "Understanding CBG Purification: PSA Technology Explained", date: "April 10, 2025", category: "cbg", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800", excerpt: "Pressure Swing Adsorption (PSA) is a cutting-edge technology used to purify raw biogas...", content: "<p>Full content here...</p>", author: "Atirath Insights", readTime: 5 },
                { title: "Budget 2025: Boost for Green Energy Initiatives", date: "April 5, 2025", category: "policy", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800", excerpt: "The Union Budget 2025 has allocated a record ₹35,000 crore for renewable energy initiatives...", content: "<p>Full content here...</p>", author: "Atirath Insights", readTime: 4 }
            ],
            careers: [
                { title: "Plant Manager", category: "management", location: "Hyderabad", experience: "8+ Years", salary: "₹12-18 LPA", type: "Full Time", description: "Lead and manage overall plant operations...", requirements: ["8+ years experience", "B.Tech in Chemical/Mechanical"], status: "active" },
                { title: "Chemical Engineer", category: "engineering", location: "Mumbai", experience: "3-5 Years", salary: "₹6-10 LPA", type: "Full Time", description: "Design and optimize biogas purification processes...", requirements: ["B.Tech/M.Tech in Chemical Engineering", "PSA knowledge preferred"], status: "active" }
            ],
            team: [
                { name: "Rajesh Kumar", position: "Chairman & Managing Director", qualification: "B.Tech (IIT Delhi) | MBA (ISB)", bio: "With over 25 years of experience in renewable energy...", image: "https://placehold.co/400x400/2E9E1F/white?text=RK", order: 1 },
                { name: "Priya Sharma", position: "Chief Operating Officer", qualification: "B.E. (NIT Trichy) | MBA (IIM Ahmedabad)", bio: "Expert in operations management with 18+ years...", image: "https://placehold.co/400x400/2E9E1F/white?text=PS", order: 2 }
            ]
        }
    };

    // Helper: Parse front matter from markdown
    function parseFrontMatter(markdown) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdown.match(frontMatterRegex);
        
        if (match) {
            const frontMatter = {};
            const lines = match[1].split('\n');
            lines.forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    let key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    // Remove quotes if present
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    }
                    // Handle arrays
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
                    }
                    frontMatter[key] = value;
                }
            });
            return { ...frontMatter, content: match[2] };
        }
        return { content: markdown };
    }

    // Load a single markdown file
    async function loadMarkdownFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) return null;
            const text = await response.text();
            return parseFrontMatter(text);
        } catch (error) {
            console.error(`Error loading ${path}:`, error);
            return null;
        }
    }

    // Load all files from a directory (requires file listing API)
    async function loadDirectory(directoryPath) {
        // This is a simplified version - in production, you'd need a file listing API
        // For Netlify, you can use a static file list or a serverless function
        console.log(`Loading from ${directoryPath}...`);
        return null;
    }

    // Load all blogs
    async function loadBlogs() {
        try {
            // Try to load from CMS first
            const files = await loadDirectory(CONFIG.blogPath);
            if (files && files.length > 0) {
                const blogs = await Promise.all(files.map(async file => {
                    const data = await loadMarkdownFile(file.path);
                    return data;
                }));
                return blogs.filter(b => b && b.title);
            }
        } catch (error) {
            console.log('CMS not available, using fallback data');
        }
        return CONFIG.fallback.blog;
    }

    // Load all careers
    async function loadCareers() {
        try {
            const files = await loadDirectory(CONFIG.careersPath);
            if (files && files.length > 0) {
                const careers = await Promise.all(files.map(async file => {
                    const data = await loadMarkdownFile(file.path);
                    return data;
                }));
                return careers.filter(c => c && c.title && c.status === 'active');
            }
        } catch (error) {
            console.log('CMS not available, using fallback careers');
        }
        return CONFIG.fallback.careers;
    }

    // Load team members
    async function loadTeam() {
        try {
            const files = await loadDirectory(CONFIG.teamPath);
            if (files && files.length > 0) {
                const team = await Promise.all(files.map(async file => {
                    const data = await loadMarkdownFile(file.path);
                    return data;
                }));
                return team.filter(t => t && t.name).sort((a, b) => (a.order || 0) - (b.order || 0));
            }
        } catch (error) {
            console.log('CMS not available, using fallback team');
        }
        return CONFIG.fallback.team;
    }

    // Load gallery items
    async function loadGallery() {
        try {
            const files = await loadDirectory(CONFIG.galleryPath);
            if (files && files.length > 0) {
                const gallery = await Promise.all(files.map(async file => {
                    const data = await loadMarkdownFile(file.path);
                    return data;
                }));
                return gallery.filter(g => g && g.title);
            }
        } catch (error) {
            console.log('CMS not available, using fallback gallery');
        }
        return [];
    }

    // Load press releases
    async function loadPress() {
        try {
            const files = await loadDirectory(CONFIG.pressPath);
            if (files && files.length > 0) {
                const press = await Promise.all(files.map(async file => {
                    const data = await loadMarkdownFile(file.path);
                    return data;
                }));
                return press.filter(p => p && p.title).sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        } catch (error) {
            console.log('CMS not available, using fallback press');
        }
        return [];
    }

    // Public API
    return {
        loadBlogs,
        loadCareers,
        loadTeam,
        loadGallery,
        loadPress,
        parseFrontMatter,
        loadMarkdownFile
    };
})();

// Make it globally available
window.AtirathCMS = AtirathCMS;