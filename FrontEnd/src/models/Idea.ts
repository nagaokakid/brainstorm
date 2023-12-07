/*
 * Idea.ts
 * -----------------------------
 * This file is the model for the Idea object.
 * ----------------------------------------------------------
 * Author:  Mr. Roland Fehr
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 0.0.1
*/

export default interface Idea{
    id: string;
    thought: string;
    likes: number;
    dislikes: number;
}