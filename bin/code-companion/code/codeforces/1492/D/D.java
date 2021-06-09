import java.util.*;
import java.io.*;

public class Main {          // change class name as your file name

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new File("input.txt")); // br.readLine() for taking input line by line
        PrintStream stream = new PrintStream(new File("output.txt"));
        System.setOut(stream);         

        // Write your code here
    }
}