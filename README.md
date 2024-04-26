<div align="center">
  <img src="https://github.com/JustPowerful/BrainyDocs/assets/50250163/c2866932-6052-4d9d-91b6-aeb7b3a22b65" width="400px" />
  <hr/>
</div>

# BrainyDocs

BrainyDocs is an innovative platform designed to simplify studying using the OpenAI API. It serves as a multi-functional open-source project aimed at making learning more accessible and efficient. Leveraging a variety of stack technologies such as PostgreSQL, Next.js, and more, BrainyDocs offers a comprehensive solution for learners of all levels.

## Features

### 1. Simplified Studying

BrainyDocs streamlines the studying process by providing easy access to a wealth of educational resources and tools powered by the OpenAI API. Users can seamlessly navigate through various study materials and utilize intelligent features to enhance their learning experience.

### 2. Multi-functional Platform

From interactive study guides to AI-powered quizzes and exercises, BrainyDocs offers a diverse range of functionalities to cater to different learning preferences and styles. Whether you're a visual learner or prefer hands-on practice, there's something for everyone on the platform.

### 3. Open-Source Collaboration

As an open-source project, BrainyDocs encourages collaboration and contribution from the community. Developers can actively participate in enhancing the platform's features, fixing bugs, and expanding its capabilities to better serve the needs of users worldwide.

## Stack

BrainyDocs utilizes a robust stack of technologies to deliver a seamless studying experience:

- **PostgreSQL**: A powerful NoSQL database used for storing and managing data efficiently.
- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **OpenAI API**: Harnesses the power of artificial intelligence to provide intelligent features and functionalities for studying.
- **Node.js**: A runtime environment for executing JavaScript code outside of a web browser, commonly used for server-side applications.
- **React**: A JavaScript library for building user interfaces, providing a dynamic and interactive user experience.

## Getting Started

To get started with BrainyDocs, follow these simple steps:

1. **Clone the Repository**: Clone the BrainyDocs repository to your local machine using Git.

   ```
   git clone https://github.com/JustPowerful/brainydocs.git
   ```

2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies using npm or yarn.

   ```
   cd brainydocs
   npm install
   ```

3. **Set Up Postgres**: Set up a PostgreSQL database and configure the connection details in the `.env` file.

   ```
   DATABASE_URL=postgres://user:password@localhost:5432/brainydocs
   ```

   note: i've prepared a docker-compose file for you to use, just run `docker-compose up` and you're good to go.

4. **Prisma Migrate** : Run the Prisma migration to create the necessary database schema and tables.

   ```
   npx prisma migrate dev
   ```

   or push to the database

   ```
   npx prisma db push
   ```

5. **.ENV variables to change**:

   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

6. **Start the Development Server**: Run the development server to start the BrainyDocs application and you're all set!

   ```
   npm run dev
   ```

7. **Contribute to the project!** : Make your changes and submit a pull request to contribute to the BrainyDocs project.

## Contributing

We welcome contributions from developers of all skill levels. Whether you're fixing a typo in the documentation or implementing a new feature, every contribution makes a difference. To contribute to BrainyDocs, please follow these guidelines:

1. Fork the repository and create your branch from the `main` branch.
2. Make your changes and ensure they adhere to the project's coding style and guidelines.
3. Test your changes thoroughly.
4. Submit a pull request, providing a clear description of the changes you've made and why they're necessary.

## License

BrainyDocs is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
