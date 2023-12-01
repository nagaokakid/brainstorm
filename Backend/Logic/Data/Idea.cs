/** 
 *  Idea.cs
 *  --------------------
 *  Represents a Idea object from the database.
 *  This file contains the data for the Idea
 *  ---------------------------------------------------------
 *   Author: Mr. Roland Fehr
 *   Last modified: 28.10.2023
 *   Version: 1.0
*/

namespace Logic.Data
{
    /// <summary>
    ///   This class contains data for the Idea
    /// </summary>
    public class Idea
    {
        public string Id { get; set; }
        public string Thought { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
    }
}
