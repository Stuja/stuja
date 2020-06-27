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
 * Class Wall connects two Grids together. It is not necessarily opened. If opened, it
 * allows the Mouse to pass through to each of the Grids. Otherwise, no mouse can pass
 * through it. The construction of the Maze uses a Depth-First Search algorithm. In a 
 * graph, Wall will be the edge. 
 */
public class Wall
{
	private Grid nextGrid;
	private Grid otherGrid;
	private boolean opened;
	
	/**
	 * Creates a new instance of Wall
	 * @param nextGrid The first Grid to be connected by this wall
	 * @param otherGrid The second Grid to be connected by this wall
	 */
	public Wall(Grid nextGrid, Grid otherGrid)
	{
		this.nextGrid = nextGrid;
		this.otherGrid = otherGrid;
		opened = false;
	}
	
	/**
	 * Get the other grid of connected by the wall that is not the current grid
	 * @param currentGrid The current grid that connected by the wall.
	 * @return The other grid this is also connected by the wall.
	 */
	public Grid getNextGrid(Grid currentGrid)
	{
		return this.nextGrid == currentGrid ? this.otherGrid : this.nextGrid;
	}
	
	/**
	 * Get the first grid.
	 * @return The first grid
	 */
	public Grid getNextGrid()
	{
		return this.nextGrid;
	}
	
	/**
	 * Get the second grid 
	 * @return The second grid
	 */
	public Grid getOtherGrid()
	{
		return this.otherGrid;
	}
	
	/**
	 * Determine if the wall is opened.
	 * @return True if opened, False if otherwise.
	 */
	public boolean isOpened()
	{
		return this.opened;
	}
	
	/**
	 * Sets the wall closed or opened.
	 * @param opened True for open, False for close
	 */
	public void setOpened(boolean opened)
	{
		this.opened = opened;
	}
	
}