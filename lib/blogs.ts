import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  id: number; 
  title: string;
  date: Date;
  description: string;
  tags: string[];
  content?: string;
}

const uploadsDir = path.join(process.cwd(), 'public/uploads');

export function getAllDynamicPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(uploadsDir);

  return fileNames
    .filter(file => file.endsWith(".md")) // only numeric filenames
    .map(fileName => {
      const fullPath = path.join(uploadsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        id: data.title.replace(/\s+/g, "_"),
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags || [],
      };
    })
    .sort((a, b) => b.id - a.id); // optional: sort newest first
}

export function getDynamicPostById(id: string): BlogPost {
  // Find the file whose title (with spaces replaced by _) matches the id
  const fileNames = fs.readdirSync(uploadsDir);
  const fileName = fileNames.find(name => {
    const fileContents = fs.readFileSync(path.join(uploadsDir, name), 'utf8');
    const { data } = matter(fileContents);
    return data.title.replace(/\s+/g, "_") === id;
  });

  if (!fileName) {
    throw new Error(`Post with id "${id}" not found.`);
  }

  const fullPath = path.join(uploadsDir, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    id: data.title.replace(/\s+/g, "_"),
    title: data.title,
    date: data.date,
    description: data.description,
    tags: data.tags || [],
    content,
  };
}
