-- Kodnest LMS Seed Data

-- Subjects
INSERT INTO subjects (id, title, slug, description, thumbnail_url, is_published) VALUES
(1, 'Java Full Stack Development', 'java-full-stack', 'Master Java from basics to advanced full-stack development with Spring Boot, Hibernate, and modern web technologies.', NULL, TRUE),
(2, 'Python Programming', 'python-programming', 'Learn Python from scratch – covering core syntax, OOP, data structures, and real-world projects.', NULL, TRUE),
(3, 'Data Structures & Algorithms', 'dsa', 'Comprehensive DSA course covering arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming.', NULL, TRUE);

-- Sections for Java Full Stack (subject_id = 1)
INSERT INTO sections (id, subject_id, title, order_index) VALUES
(1, 1, 'Java Basics', 0),
(2, 1, 'Object-Oriented Programming', 1),
(3, 1, 'Spring Boot Essentials', 2);

-- Sections for Python (subject_id = 2)
INSERT INTO sections (id, subject_id, title, order_index) VALUES
(4, 2, 'Python Fundamentals', 0),
(5, 2, 'Data Structures in Python', 1),
(6, 2, 'Python OOP', 2);

-- Sections for DSA (subject_id = 3)
INSERT INTO sections (id, subject_id, title, order_index) VALUES
(7, 3, 'Arrays & Strings', 0),
(8, 3, 'Linked Lists', 1),
(9, 3, 'Trees & Graphs', 2);

-- Videos for Java Basics (section_id = 1)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(1, 1, 'Introduction to Java', 'Getting started with Java programming language', 'https://www.youtube.com/watch?v=eIrMbAQSU34', 0, 900),
(2, 1, 'Variables and Data Types', 'Learn about Java variables, primitives, and data types', 'https://www.youtube.com/watch?v=le-URjBhevE', 1, 1200),
(3, 1, 'Control Flow Statements', 'If-else, switch, loops in Java', 'https://www.youtube.com/watch?v=ldYLYRNaucM', 2, 1500);

-- Videos for OOP (section_id = 2)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(4, 2, 'Classes and Objects', 'Understanding classes, objects, and constructors', 'https://www.youtube.com/watch?v=IUqKuGNasdM', 0, 1800),
(5, 2, 'Inheritance and Polymorphism', 'Deep dive into inheritance, polymorphism, and abstraction', 'https://www.youtube.com/watch?v=Zs342ePFvRI', 1, 2100),
(6, 2, 'Interfaces and Abstract Classes', 'Implementing interfaces and abstract classes in Java', 'https://www.youtube.com/watch?v=GhslBwrRsnw', 2, 1600);

-- Videos for Spring Boot (section_id = 3)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(7, 3, 'Spring Boot Setup', 'Setting up your first Spring Boot project', 'https://www.youtube.com/watch?v=9SGDpanrc8U', 0, 1400),
(8, 3, 'REST APIs with Spring', 'Building RESTful APIs using Spring Boot', 'https://www.youtube.com/watch?v=MWLe1tqPmUo', 1, 2400),
(9, 3, 'Spring Data JPA', 'Database integration with Spring Data JPA and Hibernate', 'https://www.youtube.com/watch?v=8SGI_XS5OPw', 2, 2000);

-- Videos for Python Fundamentals (section_id = 4)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(10, 4, 'Getting Started with Python', 'Installing Python and writing your first program', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 0, 800),
(11, 4, 'Variables and Operators', 'Python variables, operators, and expressions', 'https://www.youtube.com/watch?v=cQT33yu9pY8', 1, 1100),
(12, 4, 'Control Structures', 'Conditionals and loops in Python', 'https://www.youtube.com/watch?v=PqFKRqpHrjw', 2, 1300);

-- Videos for Data Structures in Python (section_id = 5)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(13, 5, 'Lists and Tuples', 'Working with Python lists and tuples', 'https://www.youtube.com/watch?v=W8KRzm-HUcc', 0, 1500),
(14, 5, 'Dictionaries and Sets', 'Python dictionaries, sets, and their operations', 'https://www.youtube.com/watch?v=daefaLgNkw0', 1, 1400),
(15, 5, 'Comprehensions', 'List, dict, and set comprehensions', 'https://www.youtube.com/watch?v=3dt4OGnU5sM', 2, 1000);

-- Videos for Python OOP (section_id = 6)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(16, 6, 'Classes in Python', 'Creating classes and objects in Python', 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM', 0, 1600),
(17, 6, 'Inheritance in Python', 'Single and multiple inheritance', 'https://www.youtube.com/watch?v=Cn7AkDb4pIU', 1, 1800),
(18, 6, 'Magic Methods', 'Dunder methods and operator overloading', 'https://www.youtube.com/watch?v=3ohzBxoFHAY', 2, 1200);

-- Videos for Arrays & Strings (section_id = 7)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(19, 7, 'Array Fundamentals', 'Understanding arrays, memory layout, and basic operations', 'https://www.youtube.com/watch?v=QJNwK2uJyGs', 0, 1700),
(20, 7, 'Two Pointer Technique', 'Solving array problems with two pointers', 'https://www.youtube.com/watch?v=On03HWe2tZM', 1, 2000),
(21, 7, 'String Manipulation', 'Common string algorithms and problems', 'https://www.youtube.com/watch?v=Qtpkq3Rfauw', 2, 1900);

-- Videos for Linked Lists (section_id = 8)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(22, 8, 'Singly Linked List', 'Implementing and traversing singly linked lists', 'https://www.youtube.com/watch?v=N6dOwBde7-M', 0, 2200),
(23, 8, 'Doubly Linked List', 'Doubly linked list implementation and operations', 'https://www.youtube.com/watch?v=e9NG_a6Z0mg', 1, 1800),
(24, 8, 'Linked List Problems', 'Classic linked list interview problems', 'https://www.youtube.com/watch?v=70tx7KcMROc', 2, 2500);

-- Videos for Trees & Graphs (section_id = 9)
INSERT INTO videos (id, section_id, title, description, youtube_url, order_index, duration_seconds) VALUES
(25, 9, 'Binary Trees', 'Binary tree traversals and operations', 'https://www.youtube.com/watch?v=fAAZixBzIAI', 0, 2300),
(26, 9, 'Binary Search Trees', 'BST operations, balancing, and applications', 'https://www.youtube.com/watch?v=cySVml6e_Fc', 1, 2100),
(27, 9, 'Graph Algorithms', 'BFS, DFS, shortest path algorithms', 'https://www.youtube.com/watch?v=tWVWeAqZ0WU', 2, 2800);
