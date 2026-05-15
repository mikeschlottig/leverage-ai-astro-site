    React Components Can't Use Astro <Image> — But CAN Use Sharp URLs
    
    In .tsx React components, you can't use Astro's <Image>. But importing from blog-images.ts and using .src gives you
    the Sharp-processed WebP hash URL for a plain <img> tag — no srcset, but still processed and cached.
    
    import { siteImages } from '../lib/blog-images';
    const src = siteImages['compost-hands.jpg']?.src ?? '/images/compost-hands.jpg';
    
    Token Cost Reality Check
    
    - First-time Sharp setup + image() helper debugging: ~200K tokens
    - Missed mobile responsive classes on one component: ~26K tokens
    - Writing this doc entry: ~800 tokens
    
    Document before you build. Responsive classes are not optional.
    
    ---
    Save this to Astro Project Structure.md or a dedicated Astro Pitfalls.md in the project root.
