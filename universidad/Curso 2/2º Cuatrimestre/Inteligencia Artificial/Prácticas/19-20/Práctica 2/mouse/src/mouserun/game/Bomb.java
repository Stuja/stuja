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
 * Class Bomb. Any Mouse implementation can drop a Bomb to hinder another Mouse
 * from advancing. If a Mouse comes across a Bomb that does not belong to it,
 * it will explode and be "respawned" at another random location. To drop a Bomb,
 * Mouse should return Mouse.BOMB in the move() method.
 * 
 * Players should be wary with the use of the Bomb because while it may hinder the
 * other Mouse from advancing, it may relocate the other Mouse closer to the Cheese.
 */
public class Bomb
{

	private int x;
	private int y;
	private boolean detonated;
	private Mouse mouse;
	
	/**
	 * Constructor. 
	 * Creates a new instance of the bomb.
	 * @param x The X axis of the location of the bomb.
	 * @param y The Y axis of the location of the bomb.
	 * @param mouse The mouse that planted the bomb.
	 */
	public Bomb(int x, int y, Mouse mouse)
	{
		this.x = x;
		this.y = y;
		this.mouse = mouse;
		detonated = false;
	}
	
	/**
	 * Get the X-axis of the location of the bomb.
	 * @return The X-axis of the location of the bomb.
	 */
	public int getX()
	{
		return x;
	}
	
	/**
	 * Get the Y-axis of the location of the bomb.
	 * @return The Y-axis of the location of the bomb.
	 */
	public int getY()
	{
		return y;
	}
		
	/**
	 * Get the Mouse that planted the bomb.
	 * @return The Mouse that planted the bomb.
	 */
	public Mouse getMouse()
	{
		return mouse;
	}
	
	/**
	 * Determine if the bomb has been detonated when a mouse comes across it.
	 * @return True if bomb has been detonated. False if otherwise.
	 */
	public boolean hasDetonated()
	{
		return detonated;
	}
	
	/**
	 * Mark the bomb has detonated if it has not been detonated already.
	 */
	public void detonate()
	{
		detonated = true;
	}

}