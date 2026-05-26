import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Dados do portfólio (Mock)
const profileData = {
    name: "Cristian Martinez",
    role: "Front-End Engineer",
    location: "Palhoça, BR",
    experience: "+2",
    projectsCount: "15+",
    bio: "Engenheiro Front-End transformando complexidade em simplicidade visual",
    githubUser: "CristianMartinezApi",
    email: "fernandesribe04@gmail.com",
    skills: [
        { name: "React.js", type: "Componentização", color: "#61DAFB" },
        { name: "TypeScript", type: "Tipagem Estática", color: "#3178C6" },
        { name: "JavaScript", type: "Modern ES6+", color: "#F7DF1E" },
        { name: "GSAP", type: "Motion Design", color: "#88CE02" },
        { name: "Tailwind", type: "Atomic CSS", color: "#06B6D4" },
        { name: "Vite", type: "Bundler Moderno", color: "#BD34FE" }
    ]
};

app.get('/api/profile', (req, res) => {
    res.json(profileData);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
