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
package mouserun.mouse;

import java.io.*;
import java.util.*;
import java.net.*;
import mouserun.game.*;

/**
 * Class MouseLoader detects and load all Mouse implementations
 * packaged under mouserun.mouse
 */
public class MouseLoader
{
	private static final String PACKAGE = "mouserun.mouse.";
	private static ArrayList<Class<?>> detected = null;

	/**
	 * Detects all Mouse Implementations in the package mouserun.mouse.
	 * @return All the Mouse Implementation Classes which can be used to seed an instance.
	 */
	public static ArrayList<Class<?>> load()
	{
		detected = new ArrayList<Class<?>>();
		
		try
		{
			File directory = new File(getClassDirectory());
			File[] classFiles = directory.listFiles();
			
			if (classFiles != null)
			{
				for (File file : classFiles)
				{
					if (file.getName().endsWith(".class"))
					{
						String className = PACKAGE + file.getName().replace(".class", "");
						
						Class<?> clz = Class.forName(className);
					
						if (clz.getSuperclass() == Mouse.class)
						{						
							//System.out.println("Mouse Detected: " + clz.getSimpleName());
							detected.add(clz);
						}
					}
				}
			}
			//System.out.println();
			
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
		
		return detected;
	}
	
	public static ArrayList<Class<?>> getDetectedMouseClasses()
	{
		if (detected == null)
		{
			detected = new ArrayList<Class<?>>();
		}
		
		return detected;
	}

	// Gets the current directory of the MouseLoader that will be used as an anchor point
	// to get all other Mouse in the same package. This method will throw IllegalStateException
	// if the MouseLoader is not a directory, because this game is only designed to be
	// executed using the java command through the GameStarter.class 
	private static String getClassDirectory()
	{
		String file = "MouseLoader.class";
		URL location = MouseLoader.class.getResource(file);
		
		if (!location.getProtocol().equalsIgnoreCase("file"))
		{
			throw new IllegalStateException("MouseRun is not intended to run in this manner.");
		}
		
		String locationPath = location.getPath();
		locationPath = locationPath.substring(0, locationPath.length() - file.length());
		
		try
		{
			locationPath = URLDecoder.decode(locationPath, "UTF-8");
		}
		catch (UnsupportedEncodingException uee)
		{
			// do nothing here.
		}
		
		return locationPath;
	}
	
}
