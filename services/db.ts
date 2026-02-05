// This service acts as the interface to our Local Storage "Database"
export const DB_KEYS = {
  MENU: 'tableSwift_menu',
  CATEGORIES: 'tableSwift_categories',
  RESTAURANT_NAME: 'tableSwift_name',
  TELEGRAM: 'tableSwift_telegram'
};

export const db = {
  /**
   * Load data from the database (localStorage)
   * @param key Database key (table name)
   * @param defaultValue Default value if table is empty
   */
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.warn(`DB Load Error [${key}]:`, error);
      return defaultValue;
    }
  },

  /**
   * Save data to the database (localStorage)
   * @param key Database key (table name)
   * @param value Data to save
   */
  save: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`DB Save Error [${key}]:`, error);
    }
  }
};
