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
 * Class BombThread removes the Bomb representation from the Game Interface after 
 * detonation. The purpose of this class is to give ample time for the Game Interface
 * to display the explosion image before the representation is removed. 
 */
public class BombThread
	extends Thread
{

	private GameControllerAdapter adapter;
	private Bomb bomb;
	
	/**
	 * Creates an instance of the thread.
	 * @param adapter The adapter that controls the UI of the game.
	 * @param bomb The bomb that is to be removed.
	 */
	public BombThread(GameControllerAdapter adapter, Bomb bomb)
	{
		this.adapter = adapter;
		this.bomb = bomb;
	}
	
	/**
	 * Begin to execute the thread. Executing this directly will
	 * cause the method to run in the same thread. Use Start() method instead.
	 * @see Runnable
	 */
	public void run()
	{
		try
		{
			Thread.sleep(1000);
		}
		catch (InterruptedException ex)
		{
			// This is expected and should be ignored;
		}
		
		adapter.removeBomb(bomb);
	}

}