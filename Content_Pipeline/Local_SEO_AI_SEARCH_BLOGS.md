Local_SEO_AI_SEARCH_BLOGS

AI assistant built in.

<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Semantic Synchronization Mandate: An Interactive Blueprint</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Chosen Palette: Tech Blue & Slate -->
    <!-- Application Structure Plan: The SPA is designed as an interactive strategic guide. It begins with a high-level summary and impactful KPIs to establish urgency. A sticky navigation guides users through a logical flow: 1. The 'Paradigm Shift' uses an interactive toggle to contrast old vs. new SEO, making the core concept immediately clear. 2. The 'Core Blueprint' uses a tabbed interface to separate the GBP and Website pillars, preventing cognitive overload. 3. The 'AI Frontier' visually explains the "Trust Triangle" for LLMO. 4. An 'E-E-A-T Accordion' breaks down Google's quality framework into digestible parts. 5. It concludes with an 'Actionable Checklist'. This modular, task-oriented flow was chosen to make the dense, strategic report accessible and actionable for both marketing experts and business owners. -->
    <!-- Visualization & Content Choices: 
        - Impact KPIs (Top): Report Info -> Benefits of sync. Goal -> Inform/Impact. Viz -> Statistic cards (HTML/CSS). Interaction -> None. Justification -> High-impact intro. Library -> HTML/Tailwind.
        - Old vs. New SEO: Report Info -> Keyword vs. Entity focus. Goal -> Compare concepts. Viz -> HTML/CSS diagram. Interaction -> Toggle button to switch views. Justification -> Visually and interactively clarifies the core thesis. Library -> JS.
        - GBP Completeness Impact: Report Info -> Value of a full GBP. Goal -> Show relationship. Viz -> Bar Chart. Interaction -> Hover tooltips. Justification -> Quantifies the benefits discussed in the report. Library -> Chart.js.
        - E-E-A-T Framework: Report Info -> E-E-A-T definitions. Goal -> Organize/Explain. Viz -> Accordion. Interaction -> Click to expand/collapse. Justification -> Breaks a complex framework into easy-to-learn parts. Library -> JS.
        - LLM Data Sources: Report Info -> How AI finds info. Goal -> Show proportion. Viz -> Donut Chart. Interaction -> Hover tooltips. Justification -> Shows the importance of a diverse digital presence for AI citation. Library -> Chart.js.
    -->
    <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
            color: #212529;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            height: 300px;
            max-height: 400px;
        }
        @media (min-width: 768px) {
            .chart-container { height: 350px; }
        }
        .nav-link.active {
            color: #0d6efd;
            border-bottom-color: #0d6efd;
            font-weight: 600;
        }
        .blueprint-tab.active {
            background-color: #0d6efd;
            color: #ffffff;
        }
        .accordion-header.active {
            background-color: #e7f1ff;
        }
        .accordion-header.active .accordion-icon {
            transform: rotate(180deg);
        }
        .accordion-icon {
            transition: transform 0.3s ease;
        }
    </style>
</head>
<body class="antialiased">

    <header class="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <h1 class="text-xl md:text-2xl font-bold text-[#0d6efd]">Semantic Sync</h1>
                <div class="hidden md:flex md:space-x-8">
                    <a href="#shift" class="nav-link text-gray-600 hover:text-[#0d6efd] border-b-2 border-transparent pb-1 transition-colors duration-300">The Shift</a>
                    <a href="#blueprint" class="nav-link text-gray-600 hover:text-[#0d6efd] border-b-2 border-transparent pb-1 transition-colors duration-300">Blueprint</a>
                    <a href="#ai" class="nav-link text-gray-600 hover:text-[#0d6efd] border-b-2 border-transparent pb-1 transition-colors duration-300">AI Frontier</a>
                    <a href="#eeat" class="nav-link text-gray-600 hover:text-[#0d6efd] border-b-2 border-transparent pb-1 transition-colors duration-300">E-E-A-T</a>
                    <a href="#ai-tools" class="nav-link text-gray-600 hover:text-[#0d6efd] border-b-2 border-transparent pb-1 transition-colors duration-300">✨ AI Tools</a>
                </div>
            </div>
        </nav>
    </header>

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <section class="text-center mb-16 md:mb-20">
            <h2 class="text-3xl md:text-5xl font-bold mb-4 text-gray-800">The Semantic Synchronization Mandate</h2>
            <p class="max-w-3xl mx-auto text-gray-600 mb-8 text-lg">A strategic blueprint for local search dominance in the AI era. It's time to stop thinking in keywords and start building a unified, machine-readable business entity.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div class="text-4xl font-bold text-[#0d6efd]">+75%</div>
                    <div class="text-gray-500 mt-2 font-medium">Map Pack Visibility for Synced Entities</div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div class="text-4xl font-bold text-[#198754]">+3x</div>
                    <div class="text-gray-500 mt-2 font-medium">Higher Citation Rate in AI Answers</div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div class="text-4xl font-bold text-[#dc3545]">-50%</div>
                    <div class="text-gray-500 mt-2 font-medium">Trust Erosion from NAP Inconsistency</div>
                </div>
            </div>
        </section>

        <section id="shift" class="pt-20 -mt-16 mb-16 md:mb-20">
            <h3 class="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">The Paradigm Shift: From Keywords to Context</h3>
            <p class="text-center text-gray-600 max-w-3xl mx-auto mb-10">AI-driven search no longer just matches words; it understands intent and context. This section visualizes the fundamental change from a fragmented, keyword-based approach to a unified, entity-based strategy. Use the toggle to see how the focus of local SEO has evolved.</p>
            <div class="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-gray-200 max-w-4xl mx-auto">
                <div class="flex justify-center mb-6">
                    <div class="relative flex items-center bg-gray-200 rounded-full p-1">
                        <button id="toggle-old" class="w-28 py-2 text-sm font-semibold rounded-full z-10">Old SEO</button>
                        <button id="toggle-new" class="w-28 py-2 text-sm font-semibold rounded-full z-10">New SEO</button>
                        <span id="toggle-bg" class="absolute h-full w-28 bg-[#0d6efd] text-white rounded-full transition-transform duration-300 ease-in-out"></span>
                    </div>
                </div>
                <div id="seo-diagram" class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                    <!-- Diagram content will be injected by JS -->
                </div>
            </div>
        </section>

        <section id="blueprint" class="pt-20 -mt-16 mb-16 md:mb-20">
            <h3 class="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">The Core Blueprint</h3>
            <p class="text-center text-gray-600 max-w-3xl mx-auto mb-10">Semantic Synchronization requires treating your Google Business Profile (GBP) and website as two halves of a single entity. The GBP is the structured data hub, providing the core facts. The website is the authority engine, providing deep context and proof. Explore the key optimization tactics for each pillar below.</p>
            <div class="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
                <button class="blueprint-tab active py-2 px-5 rounded-full font-semibold transition-colors duration-300" data-tab="gbp">① The GBP Hub</button>
                <button class="blueprint-tab py-2 px-5 rounded-full font-semibold transition-colors duration-300 bg-gray-200 text-gray-700" data-tab="website">② The Website Engine</button>
            </div>
            <div id="blueprint-content" class="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200">
                <!-- Tab content will be injected by JS -->
            </div>
        </section>

        <section id="ai" class="pt-20 -mt-16 mb-16 md:mb-20">
            <h3 class="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">The AI Frontier: Optimizing for Citation</h3>
            <p class="text-center text-gray-600 max-w-3xl mx-auto mb-10">The goal in AI-powered search is not just to rank, but to be cited as the authoritative source. AI models build trust by corroborating information across multiple sources. A strong, consistent signal across structured data, web content, and social proof—the "Trust Triangle"—makes your business a reliable and citable entity.</p>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                     <h4 class="font-semibold text-center mb-4 text-gray-700">Primary Data Sources for AI Answer Engines</h4>
                     <div class="chart-container">
                        <canvas id="aiSourcesChart"></canvas>
                    </div>
                </div>
                 <div class="text-center">
                    <h4 class="font-semibold mb-4 text-xl text-gray-800">The AI Trust Triangle</h4>
                    <div class="p-6">
                        <div class="relative w-full max-w-sm mx-auto">
                            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0d6efd] rounded-full"></div>
                            <div class="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-[#198754] rounded-full"></div>
                            <div class="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-4 h-4 bg-[#dc3545] rounded-full"></div>
                            <div class="border-2 border-dashed border-gray-300 aspect-square rounded-full flex items-center justify-center">
                                <div class="text-2xl font-bold text-[#0d6efd]">TRUST</div>
                            </div>
                            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-center">
                                <p class="font-semibold text-gray-800">Web Content</p><p class="text-xs text-gray-500">(The "Why")</p>
                            </div>
                            <div class="absolute bottom-0 left-0 -translate-x-12 translate-y-4 text-center">
                                <p class="font-semibold text-gray-800">Structured Data</p><p class="text-xs text-gray-500">(The "What/Where")</p>
                            </div>
                            <div class="absolute bottom-0 right-0 translate-x-12 translate-y-4 text-center">
                                <p class="font-semibold text-gray-800">Social Proof</p><p class="text-xs text-gray-500">(The "How Good")</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="eeat" class="pt-20 -mt-16">
            <h3 class="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">The E-E-A-T Imperative</h4>
            <p class="text-center text-gray-600 max-w-3xl mx-auto mb-10">Google's quality guidelines (Experience, Expertise, Authoritativeness, Trustworthiness) are the filter for what constitutes "helpful content." For local businesses, demonstrating first-hand experience is the ultimate competitive advantage against generic, AI-generated content. Click each component to learn how to apply it.</p>
            <div id="accordion" class="space-y-3 max-w-4xl mx-auto">
                <!-- Accordion items will be injected by JS -->
            </div>
        </section>

        <section id="ai-tools" class="pt-20 -mt-16">
            <h3 class="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">✨ AI-Powered Toolkit</h3>
            <p class="text-center text-gray-600 max-w-3xl mx-auto mb-10">Move from strategy to execution. Use these AI-powered tools to generate content and responses that align with the Semantic Synchronization mandate, saving you time and enhancing your local presence.</p>
            <div class="max-w-4xl mx-auto">
                <div class="mb-6 border-b border-gray-200">
                    <nav class="flex space-x-4" aria-label="Tabs">
                        <button class="ai-tool-tab active py-3 px-4 font-semibold text-sm border-b-2 border-[#0d6efd] text-[#0d6efd]">Content Ideas</button>
                        <button class="ai-tool-tab py-3 px-4 font-semibold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700">GBP Q&A</button>
                        <button class="ai-tool-tab py-3 px-4 font-semibold text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700">Review Responder</button>
                    </nav>
                </div>

                <div id="ai-tool-content" class="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-200">
                    <!-- AI Tool Content will be injected by JS -->
                </div>
            </div>
        </section>

    </main>
    
    <footer class="bg-gray-100 mt-16 md:mt-20 border-t">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
            <p>Based on the "Semantic Synchronization Mandate" report. This is an interactive demonstration.</p>
        </div>
    </footer>

    <script>
    document.addEventListener('DOMContentLoaded', () => {

        const seoDiagrams = {
            old: `
                <div class="text-center p-4 border-r-2 border-dashed border-gray-200">
                    <div class="text-5xl mb-2">🏢</div>
                    <h4 class="font-semibold text-gray-800">GBP</h4>
                    <p class="text-xs text-gray-500">Keywords: "Plumber Austin"</p>
                </div>
                <div class="flex items-center justify-center">
                    <p class="text-3xl text-gray-300 font-light">↔</p>
                </div>
                <div class="text-center p-4 border-l-2 border-dashed border-gray-200">
                    <div class="text-5xl mb-2">🌐</div>
                    <h4 class="font-semibold text-gray-800">Website</h4>
                    <p class="text-xs text-gray-500">Keywords: "Austin Plumber"</p>
                </div>
                <p class="md:col-span-3 text-sm text-gray-600 mt-4"><strong>Focus:</strong> Fragmented tactics. Goal is to match specific keywords on separate platforms.</p>
            `,
            new: `
                <div class="text-center p-4 relative">
                    <div class="text-5xl mb-2">🏢</div>
                    <h4 class="font-semibold text-[#0d6efd]">Entity: Plumber</h4>
                    <p class="text-xs text-gray-500">Attribute: In Austin</p>
                </div>
                <div class="flex items-center justify-center">
                    <p class="text-3xl text-green-500 font-semibold">→</p>
                </div>
                <div class="text-center p-4">
                    <div class="text-5xl mb-2">🏆</div>
                    <h4 class="font-semibold text-[#0d6efd]">Trusted Result</h4>
                    <p class="text-xs text-gray-500">For query: "best emergency leak repair near me"</p>
                </div>
                <p class="md:col-span-3 text-sm text-gray-600 mt-4"><strong>Focus:</strong> Unified entity. GBP and Website are synchronized to prove authority and context for complex user intent.</p>
            `
        };

        const blueprintContent = {
            gbp: `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h4 class="font-bold text-xl mb-4 text-gray-800">Optimizing the Semantic Hub</h4>
                        <ul class="space-y-3 text-gray-700">
                            <li class="flex items-start"><span class="text-[#0d6efd] font-bold mr-3">✓</span><div><strong>Complete Everything:</strong> Fill out every field, especially specific attributes (e.g., 'Women-led') for conversational search.</div></li>
                            <li class="flex items-start"><span class="text-[#0d6efd] font-bold mr-3">✓</span><div><strong>Manage UGC:</strong> Encourage detailed, service-specific reviews and pre-populate the Q&A section to control the narrative.</div></li>
                            <li class="flex items-start"><span class="text-[#0d6efd] font-bold mr-3">✓</span><div><strong>Stay Active:</strong> Use Google Posts weekly, add geo-tagged photos, and keep services/products updated to signal an active, trustworthy business.</div></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-semibold text-center mb-4 text-gray-700">Impact of GBP Completeness</h5>
                        <div class="chart-container !h-72 sm:!h-80">
                            <canvas id="gbpChart"></canvas>
                        </div>
                    </div>
                </div>
            `,
            website: `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h4 class="font-bold text-xl mb-4 text-gray-800">Building the Authority Engine</h4>
                        <ul class="space-y-3 text-gray-700">
                             <li class="flex items-start"><span class="text-[#0d6efd] font-bold mr-3">✓</span><div><strong>Topical Authority:</strong> Use a 'hub-and-spoke' model with pillar pages for core services and cluster posts for specific subtopics.</div></li>
                            <li class="flex items-start"><span class="text-[#0d6efd] font-bold mr-3">✓</span><div><strong>Technical Semantics:</strong> Implement mandatory schema (LocalBusiness, FAQPage, Service) to translate your content for machines.</div></li>
                            <li class="flex items-start"><span class="text-[#0d6efd] font-bold mr-3">✓</span><div><strong>Hyperlocal Content:</strong> Create unique pages for service areas with content demonstrating genuine local experience, referencing landmarks and local testimonials.</div></li>
                        </ul>
                    </div>
                    <div class="text-center p-4">
                        <h5 class="font-semibold text-center mb-4 text-gray-700">Hub-and-Spoke Model</h5>
                        <div class="flex items-center justify-center space-x-4">
                            <div class="p-2 border rounded-lg bg-gray-100 text-xs">Spoke</div>
                            <div class="p-2 border rounded-lg bg-gray-100 text-xs">Spoke</div>
                            <div class="p-4 border-2 border-[#0d6efd] rounded-lg bg-blue-50 text-center">
                                <p class="font-bold">Pillar Page</p>
                                <p class="text-xs text-gray-600">(Core Service)</p>
                            </div>
                            <div class="p-2 border rounded-lg bg-gray-100 text-xs">Spoke</div>
                        </div>
                        <p class="text-xs text-gray-500 mt-4">Spoke pages link to the central pillar page, creating a dense web of topical authority.</p>
                    </div>
                </div>
            `
        };

        const accordionItems = [
            { title: 'Experience', content: 'The new differentiator. Showcase first-hand, real-world experience. Use original photos/videos from job sites, write case studies of local projects, and tell authentic stories. This is your defense against generic AI content.' },
            { title: 'Expertise', content: 'Demonstrate deep knowledge of your trade. Explain the "why" behind your advice, cite local building codes, discuss region-specific challenges, and prove you are a master of your craft.' },
            { title: 'Authoritativeness', content: 'Establish your reputation as a go-to source in your community. Earn local press mentions, partner with other local businesses, and build a comprehensive library of helpful content on your website.' },
            { title: 'Trustworthiness', content: 'The foundation of it all. Be transparent with clear contact info and author bios. Ensure your site is secure (HTTPS). Your reputation, validated by positive customer reviews, is the ultimate trust signal.' }
        ];

        const aiToolContent = {
            'Content Ideas': `
                <h4 class="font-bold text-xl mb-1 text-gray-800">Hyperlocal Content Idea Generator</h4>
                <p class="text-gray-600 mb-4 text-sm">Generate E-E-A-T rich blog post ideas tailored to your local business.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label for="business-type-ideas" class="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                        <input type="text" id="business-type-ideas" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Plumber, Bakery, Salon">
                    </div>
                    <div>
                        <label for="location-ideas" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input type="text" id="location-ideas" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Austin, TX">
                    </div>
                </div>
                <button id="generate-ideas-btn" class="w-full bg-[#0d6efd] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                    <span class="btn-text">✨ Generate Ideas</span>
                    <span class="loader hidden animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                </button>
                <div id="ideas-result" class="mt-6 p-4 bg-gray-50 rounded-md border hidden min-h-[100px]"></div>
            `,
            'GBP Q&A': `
                <h4 class="font-bold text-xl mb-1 text-gray-800">GBP Q&A Drafter</h4>
                <p class="text-gray-600 mb-4 text-sm">Create helpful, optimized answers for your Google Business Profile Q&A section.</p>
                <div class="mb-4">
                    <label for="business-type-qa" class="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <input type="text" id="business-type-qa" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Coffee Shop">
                </div>
                <div class="mb-4">
                    <label for="customer-question-qa" class="block text-sm font-medium text-gray-700 mb-1">Customer's Question</label>
                    <textarea id="customer-question-qa" rows="3" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Do you offer gluten-free options?"></textarea>
                </div>
                <button id="generate-qa-btn" class="w-full bg-[#0d6efd] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
                     <span class="btn-text">✨ Draft Answer</span>
                     <span class="loader hidden animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                </button>
                <div id="qa-result" class="mt-6 p-4 bg-gray-50 rounded-md border hidden min-h-[100px]"></div>
            `,
            'Review Responder': `
                <h4 class="font-bold text-xl mb-1 text-gray-800">AI Review Responder</h4>
                <p class="text-gray-600 mb-4 text-sm">Draft professional responses to customer reviews in seconds.</p>
                 <div class="mb-4">
                    <label for="business-type-review" class="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <input type="text" id="business-type-review" class="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Auto Repair Shop">
                </div>
                <div class="mb-4">
                    <label for="customer-review" class="block text-sm font-medium text-gray-700 mb-1">Customer's Review</label>
                    <textarea id="customer-review" rows="4" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Paste customer review here..."></textarea>
                </div>
                <div class="flex items-center justify-between gap-4">
                     <div class="flex items-center space-x-4">
                        <span class="text-sm font-medium text-gray-700">Sentiment:</span>
                        <label class="flex items-center"><input type="radio" name="sentiment" value="positive" class="mr-1" checked> Positive</label>
                        <label class="flex items-center"><input type="radio" name="sentiment" value="negative" class="mr-1"> Negative</label>
                    </div>
                    <button id="generate-review-btn" class="bg-[#0d6efd] text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center flex-grow">
                         <span class="btn-text">✨ Generate Response</span>
                         <span class="loader hidden animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    </button>
                </div>
                <div id="review-result" class="mt-6 p-4 bg-gray-50 rounded-md border hidden min-h-[100px]"></div>
            `
        };

        const seoDiagramEl = document.getElementById('seo-diagram');
        const toggleOldBtn = document.getElementById('toggle-old');
        const toggleNewBtn = document.getElementById('toggle-new');
        const toggleBg = document.getElementById('toggle-bg');
        
        function updateSeoDiagram(state) {
            seoDiagramEl.innerHTML = seoDiagrams[state];
            if (state === 'old') {
                toggleBg.style.transform = 'translateX(0px)';
                toggleOldBtn.style.color = 'white';
                toggleNewBtn.style.color = 'black';
            } else {
                toggleBg.style.transform = `translateX(${toggleOldBtn.offsetWidth}px)`;
                toggleOldBtn.style.color = 'black';
                toggleNewBtn.style.color = 'white';
            }
        }
        toggleOldBtn.addEventListener('click', () => updateSeoDiagram('old'));
        toggleNewBtn.addEventListener('click', () => updateSeoDiagram('new'));
        updateSeoDiagram('new');

        const blueprintTabs = document.querySelectorAll('.blueprint-tab');
        const blueprintContentEl = document.getElementById('blueprint-content');
        
        function updateBlueprintContent(tabName) {
            blueprintContentEl.innerHTML = blueprintContent[tabName];
            if (tabName === 'gbp') {
                createGbpChart();
            }
        }

        blueprintTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                blueprintTabs.forEach(t => {
                    t.classList.remove('active');
                    t.classList.add('bg-gray-200', 'text-gray-700');
                });
                tab.classList.add('active');
                tab.classList.remove('bg-gray-200', 'text-gray-700');
                updateBlueprintContent(tab.dataset.tab);
            });
        });

        const aiToolTabs = document.querySelectorAll('.ai-tool-tab');
        const aiToolContentEl = document.getElementById('ai-tool-content');

        function updateAiToolContent(tabName) {
            aiToolContentEl.innerHTML = aiToolContent[tabName];
            attachAiButtonListeners();
        }

        aiToolTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                aiToolTabs.forEach(t => {
                    t.classList.remove('active', 'text-[#0d6efd]', 'border-[#0d6efd]');
                    t.classList.add('text-gray-500', 'border-transparent');
                });
                tab.classList.add('active', 'text-[#0d6efd]', 'border-[#0d6efd]');
                tab.classList.remove('text-gray-500', 'border-transparent');
                updateAiToolContent(tab.textContent);
            });
        });

        const accordionEl = document.getElementById('accordion');
        accordionItems.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
            itemEl.innerHTML = `
                <button class="accordion-header w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors duration-300">
                    <span>${item.title}</span>
                    <span class="accordion-icon w-5 h-5 flex items-center justify-center text-gray-500">
                        <span class="font-mono font-bold text-lg">▾</span>
                    </span>
                </button>
                <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease-in-out">
                    <p class="p-4 pt-0 text-gray-600">${item.content}</p>
                </div>
            `;
            accordionEl.appendChild(itemEl);
        });

        accordionEl.addEventListener('click', (e) => {
            const header = e.target.closest('.accordion-header');
            if (header) {
                const content = header.nextElementSibling;
                const isActive = header.classList.contains('active');

                document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
                document.querySelectorAll('.accordion-content').forEach(c => c.style.maxHeight = '0px');

                if (!isActive) {
                    header.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });

        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        function simpleMarkdownToHtml(text) {
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^\s*\*\s(.*)/gm, '<li class="list-disc list-inside mb-2">$1</li>')
                .replace(/(\<li.*\>.*<\/li\>)/gs, '<ul>$1</ul>')
                .replace(/\n/g, '<br>');
        }

        async function callGemini(prompt, button) {
            const btnText = button.querySelector('.btn-text');
            const loader = button.querySelector('.loader');

            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
            button.disabled = true;

            try {
                const payload = {
                    contents: [{ parts: [{ text: prompt }] }],
                };

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                const result = await response.json();
                const candidate = result.candidates?.[0];

                if (candidate && candidate.content?.parts?.[0]?.text) {
                    return simpleMarkdownToHtml(candidate.content.parts[0].text);
                } else {
                    return 'Could not generate a response. Please try again.';
                }
            } catch (error) {
                console.error('Gemini API call failed:', error);
                return 'An error occurred. Please check the console for details.';
            } finally {
                btnText.classList.remove('hidden');
                loader.classList.add('hidden');
                button.disabled = false;
            }
        }
        
        function attachAiButtonListeners() {
            const generateIdeasBtn = document.getElementById('generate-ideas-btn');
            if (generateIdeasBtn) {
                generateIdeasBtn.addEventListener('click', async () => {
                    const businessType = document.getElementById('business-type-ideas').value;
                    const location = document.getElementById('location-ideas').value;
                    const resultDiv = document.getElementById('ideas-result');
                    if (!businessType || !location) {
                        resultDiv.innerHTML = 'Please enter both a business type and location.';
                        resultDiv.classList.remove('hidden');
                        return;
                    }
                    const prompt = `You are an expert local SEO strategist. For a "${businessType}" in "${location}", generate 5 hyperlocal blog post titles that demonstrate strong Experience, Expertise, Authoritativeness, and Trust (E-E-A-T). For each title, provide a brief 1-2 sentence description of what the post would cover. Format the output with the title in bold.`;
                    resultDiv.innerHTML = 'Generating ideas...';
                    resultDiv.classList.remove('hidden');
                    const response = await callGemini(prompt, generateIdeasBtn);
                    resultDiv.innerHTML = response;
                });
            }

            const generateQaBtn = document.getElementById('generate-qa-btn');
            if(generateQaBtn) {
                generateQaBtn.addEventListener('click', async () => {
                    const businessType = document.getElementById('business-type-qa').value;
                    const question = document.getElementById('customer-question-qa').value;
                    const resultDiv = document.getElementById('qa-result');
                    if (!businessType || !question) {
                        resultDiv.innerHTML = 'Please enter a business type and a customer question.';
                        resultDiv.classList.remove('hidden');
                        return;
                    }
                    const prompt = `You are a friendly and professional business owner of a "${businessType}". A customer has asked the following question for your Google Business Profile Q&A: "${question}". Write a clear, concise, and helpful answer that is optimized for local search. The answer should be trustworthy and demonstrate expertise.`;
                    resultDiv.innerHTML = 'Drafting answer...';
                    resultDiv.classList.remove('hidden');
                    const response = await callGemini(prompt, generateQaBtn);
                    resultDiv.innerHTML = response;
                });
            }

            const generateReviewBtn = document.getElementById('generate-review-btn');
            if (generateReviewBtn) {
                generateReviewBtn.addEventListener('click', async () => {
                    const businessType = document.getElementById('business-type-review').value;
                    const review = document.getElementById('customer-review').value;
                    const sentiment = document.querySelector('input[name="sentiment"]:checked').value;
                    const resultDiv = document.getElementById('review-result');
                     if (!businessType || !review) {
                        resultDiv.innerHTML = 'Please enter a business type and the customer\'s review.';
                        resultDiv.classList.remove('hidden');
                        return;
                    }
                    let prompt;
                    if (sentiment === 'positive') {
                        prompt = `You are a grateful business owner of a "${businessType}". A customer left the following positive review: "${review}". Write a warm and professional response that thanks the customer, mentions a specific detail from their review if possible, and encourages them to return.`;
                    } else {
                        prompt = `You are a concerned and professional business owner of a "${businessType}". A customer left the following negative review: "${review}". Write a calm, empathetic, and professional response that acknowledges their concern, apologizes for their experience, and provides a clear next step for offline resolution (e.g., 'Please call our manager at [phone number]').`;
                    }
                    resultDiv.innerHTML = 'Generating response...';
                    resultDiv.classList.remove('hidden');
                    const response = await callGemini(prompt, generateReviewBtn);
                    resultDiv.innerHTML = response;
                });
            }
        }

        const commonChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        };

        function createGbpChart() {
            const gbpCtx = document.getElementById('gbpChart')?.getContext('2d');
            if (gbpCtx) {
                new Chart(gbpCtx, {
                    type: 'bar',
                    data: {
                        labels: ['<50% Complete', '75% Complete', '100% Complete'],
                        datasets: [{
                            label: 'User Actions (Calls, Clicks, etc.)',
                            data: [50, 120, 280],
                            backgroundColor: ['#dc3545', '#ffc107', '#198754'],
                            borderRadius: 4,
                        }]
                    },
                    options: commonChartOptions
                });
            }
        }
        
        const aiSourcesCtx = document.getElementById('aiSourcesChart').getContext('2d');
        new Chart(aiSourcesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Business Website', 'GBP Data', 'Major Directories (Yelp)', 'Niche Directories', 'UGC/Social'],
                datasets: [{
                    data: [35, 30, 15, 10, 10],
                    backgroundColor: ['#0d6efd', '#6f42c1', '#198754', '#ffc107', '#dc3545'],
                    borderWidth: 2,
                    borderColor: '#f8f9fa'
                }]
            },
            options: { ...commonChartOptions, plugins: { legend: { display: true, position: 'bottom', labels: { padding: 15 } } } }
        });

        updateBlueprintContent('gbp');
        updateAiToolContent('Content Ideas');

        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('main section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
                    });
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px', threshold: 0.1 });

        sections.forEach(section => observer.observe(section));
    });
    </script>
</body>
</html>