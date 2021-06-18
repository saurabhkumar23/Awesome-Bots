## CODING COMPANION
You can save your time during contest time. You don't have to write the testcases again and again. It will also create templates which will save a lot of time. This setup will download all of your testcases from the contest.
######
- supported coding platforms:
  - Codechef
  - Codeforces
  - Leetcode
  - Atcoder

## Setup/Installation
Open your Terminal/Command in the directory for the project and run these commands.
    
    git clone "https://github.com/saurabhkumar23/Awesome-Bots.git"
    cd Awesome-Bots
    npm install #install the dependencies from package.json

## Usage
run command on your terminal:

    $npm run getTestCases

- give your coding platform (codeforces/codechef/leetcode/atcoder)
- for leetcode, you need to give your leetcode credentials.
- give your contest id. (you will find it on your contest URL. the id written at the end of the url)
![image](https://user-images.githubusercontent.com/43825814/119214579-8b2a1480-bae5-11eb-8d10-2f760fa8106b.png)
![image](https://user-images.githubusercontent.com/43825814/119214595-b44aa500-bae5-11eb-9b7a-67392bb9424c.png)
![image](https://user-images.githubusercontent.com/43825814/119214609-caf0fc00-bae5-11eb-80b9-7294d1f3bc45.png)
![image](https://user-images.githubusercontent.com/43825814/119214620-df34f900-bae5-11eb-9437-57c22480e90e.png)
- choose your coding language (cpp/java/python).
- now, script will handle everything:
    - will visit all the problems of the contest.
    - download their testcases.
    - create multiple directories A B C D E inside the Problemset directory depending on the number of problems in contest. directory flow will look like this: 
        - *code/codeforces/1492/A*
    - each directory created will have
        - input.txt : containing problem inputs.
        - output.txt : containing problem outputs.
        - for eg:- A.cpp : of choosen template (cpp/java/python)


