# Barstool Data Challenge

## Running the Code

### Prerequisites
- **Node.js**: Ensure you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).
- **MySQL Database**: You will need access to the MySQL database specified in the challenge.

### Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   Navigate to the project directory and run:
   ```bash
   npm install
   ```

### Configuration
- Update the MySQL credentials in `db.ts` if necessary.

### Running the Code
1. **Execute the Script**:
   You can run the project using the provided `run.sh` script:
   ```bash
   ./run.sh
   ```

### What the Code Does
- Fetches a list of JSONL files from the API.
- Streams and processes each file, parsing the JSONL data line by line.
- Inserts or updates each entry into the specified MySQL table.

### Example of Running
- After completing the above steps, you should see logs indicating the progress of the file processing, including batch processing statistics.