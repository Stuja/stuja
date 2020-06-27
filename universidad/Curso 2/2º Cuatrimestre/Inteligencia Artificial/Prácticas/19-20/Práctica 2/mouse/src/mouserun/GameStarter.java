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
package mouserun;
import mouserun.game.*;

/**
 * Class GameStarter is the Main class of MouseRun.
 */
public class GameStarter
{
	
	public static void main(String... args)
	{
		try
		{
			int width = Integer.parseInt(args[0]);
			int height = Integer.parseInt(args[1]);
			int numberOfCheese = Integer.parseInt(args[2]);
			int duration = 0;
						
			if (width < 5 || height < 5 || numberOfCheese < 1)
			{
				printHelp();
				return;
			}
			
			if (args.length == 4)
			{
				duration = Integer.parseInt(args[3]);
				System.out.println("Game will last for " + duration + " seconds");
			}
		
			
			GameSecurityManager.install();
			GameUI ui = new GameUI(width, height, numberOfCheese, duration);
			ui.setVisible(true);
		}
		catch (Exception ex)
		{
			System.out.println(ex.getMessage());
			ex.printStackTrace();
			printHelp();
		}
	}
	
	private static void printHelp()
	{
		System.out.println();
		System.out.println();
		System.out.println("Mouse Run Execution");
		System.out.println();
		System.out.println("java [classpath] mouserun.GameStarter <width> <height> <cheese> {duration}");
		System.out.println();
		System.out.println("[classpath]\tIf required, include classpath location. etc: -cp classes");
		System.out.println("<width>\t\tThe number of columns in the maze. Integer. REQUIRED. Min: 5");
		System.out.println("<height>\tThe number of rows in the maze. Integer. REQUIRED. Min: 5");
		System.out.println("<cheese>\tThe number of cheeses to play for. Integer. REQUIRED. Min: 1");
		System.out.println("{duration}\tOptional. The duration, in seconds, of the game play.");
		System.out.println();
	}

}