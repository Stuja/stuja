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
* Class CountDownThread counts down the number of seconds left to the game ends. 
**/
public class CountDownThread
	extends Thread
{

	private volatile int duration;
	private GameControllerAdapter adapter;
	private volatile boolean isAlive;
	
	/**
	* Creates a new instance of CountDownThread class.
	* @param adapter The adapter (usually the Game Interface) that controls the game display.
	* @param duration The duration of the game play.
	*/
	public CountDownThread(GameControllerAdapter adapter, int duration)
	{
		this.duration = duration;
		this.adapter = adapter;
		this.isAlive = true;
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Thread#run()
	 */	
	public void run()
	{
		while (duration >= 0 && isAlive)
		{			
			if (duration <= 10)
			{
				if (duration == 0)
				{
					adapter.stop();
				}
				else
				{
					adapter.displayCountDown(duration);
				}
			}

			duration--;
			try { Thread.sleep(1000); } catch (Exception ex) {}			
		
		}
	}
	
	/**
	* Causes the Count Down thread to end. This will not raise the stop event on the GameControllerAdapter.
	*/
	public void kill()
	{
		this.isAlive = false;
	}

}