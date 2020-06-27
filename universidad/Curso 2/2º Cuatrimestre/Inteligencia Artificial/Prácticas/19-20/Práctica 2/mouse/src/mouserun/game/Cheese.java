/** 
 * MouseRun. A programming game to practice building intelligent things.
 * Copyright (C) 2013  Muhammad Mustaqim
 * 
 * This file is part of MouseRun.
 *
 * MouseRun is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MouseRun is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MouseRun.  If not, see <http://www.gnu.org/licenses/>.
 **/
package mouserun.game;

/**
 * Class Cheese is the object that the Mouse implementations have to race to consume.
 * One cheese will appear on the Maze at any one time and the location of the cheese
 * will be known to all Mouse implementations. The number of cheese to play for will
 * be defined at the start of the game. The player whose Mouse implementation consume
 * the most cheese at the end of the game wins.
 */
public class Cheese
{
	private int x;
	private int y;
	
	/**
	 * Creates an instance of the cheese.
	 * @param x The X-axis of the cheese in the maze.
	 * @param y The Y-axis of the cheese in the maze.
	 */
	public Cheese(int x, int y)
	{
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Get the X-axis of the cheese in the maze.
	 * @return The X-axis of the cheese in the maze.
	 */
	public int getX()
	{
		return this.x;
	}
	
	/**
	 * Get the Y-axis of the cheese in the maze.
	 * @return The Y-axis of the cheese in the maze.
	 */
	public int getY()
	{
		return this.y;
	}

}