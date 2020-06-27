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

import java.io.*;
import java.util.*;
import java.util.concurrent.*;

/**
 * Class SequencingThread moves all MouseInstances in a round robin manner. This is 
 * executed as a Thread.
 */
public class SequencingThread
	extends Thread
{

	private ArrayList<MouseRepresent> mouseInstances;
	private HashMap<MouseRepresent, Integer> diseaseSymptomsCounter;
	private volatile boolean isAlive;

	/**
	 * Creates a new Instance of the SequencingThread
	 */
	public SequencingThread()
	{
		mouseInstances = new ArrayList<MouseRepresent>();
		diseaseSymptomsCounter = new HashMap<MouseRepresent, Integer>();
	}
	
	/**
	 * Adds a new MouseRepresent that will be moved by the SequencingThread
	 * @param instance The MouseRepresent instance to be added to the sequence 
	 */
	public void addInstance(MouseRepresent instance)
	{
		mouseInstances.add(instance);
	}
	
	/*
	 * (non-Javadoc)
	 * @see java.lang.Thread#run()
	 */
	public void run()
	{
		isAlive = true;
		
		HashMap<MouseRepresent, Grid> movableMouse = new HashMap<MouseRepresent, Grid>();
		HashMap<Long, ArrayList<MouseRepresent>> mouseTime = new HashMap<Long, ArrayList<MouseRepresent>>(); 
		HashMap<MouseRepresent, Integer> mouseMove = new HashMap<MouseRepresent, Integer>();
		ArrayList<Long> times = new ArrayList<Long>();
		
		while (isAlive)
		{
			movableMouse.clear();
			mouseTime.clear();
			mouseMove.clear();
			times.clear();
			
			ArrayList<MouseRepresent> retireList = new ArrayList<MouseRepresent>();
			for (MouseRepresent instance : mouseInstances)
			{
				if (determineMouseRetire(instance))
				{
					retireList.add(instance);
				}
			}
			
			for (MouseRepresent instance : retireList)
			{
				instance.retire();
				mouseInstances.remove(instance);
				Debug.out().println("FATAL: " + instance.getName() + " has been forced to retire.");
			}
			
			for (MouseRepresent instance : mouseInstances)
			{
				try
				{
					Grid grid = instance.control();
					if (grid != null)
					{
						movableMouse.put(instance, grid);
					}
				}
				catch (IOException ioex)
				{
	
				}
			}
			
			for (MouseRepresent instance : movableMouse.keySet())
			{
				final MouseRepresent instanceF = instance;
				final Grid gridF = movableMouse.get(instance);

				ExecutorService exe = Executors.newCachedThreadPool();
				Callable<Integer> caller = new Callable<Integer>() 
				{
					public Integer call()
					{
						return instanceF.getNextMove(gridF);
					}
				};
				
				Future<Integer> future = exe.submit(caller);
			
				try
				{
					long start = System.nanoTime();
					int move = future.get(GameConfig.MOUSE_RESPONSE_TIMEOUT, TimeUnit.MILLISECONDS);
					long end = System.nanoTime();
					
					long time = end - start;
					
					mouseMove.put(instance, move);
					
					if (mouseTime.containsKey(time))
					{
						mouseTime.get(time).add(instance);
					}
					else
					{
						ArrayList<MouseRepresent> rep = new ArrayList<MouseRepresent>();
						rep.add(instance);
						mouseTime.put(time, rep);
					}
					
					times.add(time);
					resetMouseSymptoms(instance);
				}
				catch (TimeoutException toe)
				{
					incrementSymptomCount(instance);
					Debug.out().println("WARNING: " + instance.getName() + " is too slow. Strike #" + getNumberOfSymptoms(instance));
				}
				catch (Exception ee)
				{
					if (ee.getCause() != null && ee.getCause() instanceof SecurityException)
					{
						retireImmediate(instance);
						Debug.out().println("FATAL: " + instance.getName() + " violates acceptable behaviour. It will be retired. ");					
					}
					else
					{
						incrementSymptomCount(instance);
						Debug.out().println("WARNING: " + instance.getName() + " encountered an exception. Strike #" + getNumberOfSymptoms(instance));
						Debug.out().println("Exception: " + ee.getMessage());
						//ee.printStackTrace();
					}
				}
				finally
				{
					future.cancel(true);
				}
			}
			
			while (times.size() > 0)
			{
				long time = Collections.min(times);
				times.remove(time);
				
				ArrayList<MouseRepresent> repList = mouseTime.get(time);
				Random random = new Random();
				while (repList.size() > 0)
				{
					MouseRepresent rep = repList.get(random.nextInt(repList.size()));
					rep.moveMouse(mouseMove.get(rep));
					repList.remove(rep);
				}
			}
					
			try	{ Thread.sleep(GameConfig.ROUND_SLEEP_TIME); } catch (InterruptedException itex) {	}
		}
	}
	
	/**
	 * Gets all MouseRepresents that are being moved in sequence by the SequencingThread
	 * @return All MouseRepresents that are being moved in sequence by the SequencingThread
	 */
	public ArrayList<MouseRepresent> getInstances()
	{
		return mouseInstances;
	}
	
	/**
	 * Stops the Thread
	 */
	public void kill()
	{
		isAlive = false;
	}
	
	// Increases the symptom count for the MouseRepresent by 1
	private void incrementSymptomCount(MouseRepresent instance)
	{
		if (!diseaseSymptomsCounter.containsKey(instance))
		{
			diseaseSymptomsCounter.put(instance, 1);
		}
		else
		{
			int counter = diseaseSymptomsCounter.get(instance);
			counter++;
			diseaseSymptomsCounter.put(instance, counter);
		}
	}
	
	// Mark the Mouse to be immediately retire.
	private void retireImmediate(MouseRepresent instance)
	{
		diseaseSymptomsCounter.put(instance, GameConfig.DISEASES_TO_RETIRE);
	}
	
	// Resets the MouseRepresent symptoms to 0
	private void resetMouseSymptoms(MouseRepresent instance)
	{
		diseaseSymptomsCounter.put(instance, 0);
	}
	
	// Determines if the Mouse is giving too much problem and returns a boolean value indicating whether mouse should retire.
	private boolean determineMouseRetire(MouseRepresent instance)
	{
		if (!diseaseSymptomsCounter.containsKey(instance))
		{
			return false;
		}
		else
		{
			int counter = diseaseSymptomsCounter.get(instance);
			return counter >= GameConfig.DISEASES_TO_RETIRE;
		}
	}
	
	private int getNumberOfSymptoms(MouseRepresent instance)
	{
		if (!diseaseSymptomsCounter.containsKey(instance))
		{
			return 0;
		}
		else
		{
			int counter = diseaseSymptomsCounter.get(instance);
			return counter;
		}
	}

}
