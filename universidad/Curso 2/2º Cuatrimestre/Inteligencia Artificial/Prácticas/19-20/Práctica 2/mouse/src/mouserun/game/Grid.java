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
import java.util.*;

/**
 * Class Grid is the individual Grid of the Maze. Each Grid has a maximum of four walls
 * that defines the possible directions to move from the Grid to the next. The 
 * construction of the Maze uses a Depth-First Search algorithm. In a graph, Grid will be 
 * the vertex.
 */
public class Grid
{
	private int x;
	private int y;
	
	private ArrayList<Wall> walls;
	
	/**
	 * Creates a new instance of the Grid. 
	 * @param x The column which the Grid belongs to in the Maze.
	 * @param y The row which the Grid belongs to in the Maze.
	 */
	public Grid(int x, int y)
	{
		this.x = x;
		this.y = y;
		
		this.walls = new ArrayList<Wall>();
	}
	
	/**
	 * Get the Column number that the Grid belongs to.
	 * @return The X value representing the column number in the maze.
	 */
	public int getX()
	{
		return this.x;
	}
	
	/**
	 * Get the Row number that the Grid belongs to.
	 * @return The Y value representing the row number in the maze.
	 */
	public int getY()
	{
		return this.y;
	}
	
	/**
	 * Adds a new Wall that connects the Grid to another. 
	 * @param wall The wall that connects the Grid to another.
	 */
	public void addWall(Wall wall)
	{
		this.walls.add(wall);
	}
	
	/**
	 * Determine if moving to the Left from the grid is possible.
	 * @return True if possible. False if otherwise.
	 */
	public boolean canGoLeft()
	{
		return canGo(x - 1, y);
	}
	
	/**
	 * Determine if moving to the Right from the grid is possible.
	 * @return True if possible. False if otherwise.
	 */
	public boolean canGoRight()
	{
		return canGo(x + 1, y);
	}
	
	/**
	 * Determine if moving Upward from the grid is possible.
	 * @return True if possible. False if otherwise.
	 */
	public boolean canGoUp()
	{
		return canGo(x, y + 1);
	}
	
	/**
	 * Determine if moving Downward from the grid is possible.
	 * @return True if possible. False if otherwise.
	 */
	public boolean canGoDown()
	{
		return canGo(x, y - 1);
	}
	
	/**
	 * Based on the configuration of the grid, this will return the asset name that will
	 * display this grid.
	 * @return The asset name that will display this grid.
	 */
	public String getAssetName()
	{
		return 
			(canGoUp() ? "-" : "0") + 
			(canGoDown() ? "-" : "0") + 
			(canGoRight() ? "-" : "0") + 
			(canGoLeft() ? "-" : "0") + ".png";
	}
	
	// Determine if going to a certain position from this grid is possible.
	private boolean canGo(int x, int y)
	{
		return getGrid(x, y) != null;
	}
	
	// Get the grid of a certain position that is connected to the current grid.
	// If the grid cannot be resolved, null will be returned.
	private Grid getGrid(int x, int y)
	{
		for (int i = 0; i < this.walls.size(); i++)
		{
			Wall wall = this.walls.get(i);
			if (wall.isOpened())
			{
				Grid grid = wall.getNextGrid(this);
				if (grid.getX() == x && grid.getY() == y)
				{
					return grid;
				}
			}
		}
		
		return null;
	}
	
	// Gets the right grid
	Grid right()
	{
		return getGrid(x + 1, y);
	}
	
	// Gets the left grid
	Grid left()
	{
		return getGrid(x - 1, y);
	}	
	
	// Gets the grid above
	Grid up()
	{
		return getGrid(x, y + 1);
	}
	
	// Gets the grid below
	Grid down()
	{
		return getGrid(x, y - 1);
	}
	
	// Gets all walls connected to this grid.
	ArrayList<Wall> getWalls()
	{
		return this.walls;
	}
}