import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  // Define the Translation type
  type Translation = {
    original: Text;
    translated: Text;
    targetLanguage: Text;
  };

  // Create a stable variable to store translations
  stable var translationsEntries : [(Text, Translation)] = [];
  var translations = HashMap.HashMap<Text, Translation>(0, Text.equal, Text.hash);

  // Initialize the translations HashMap from the stable variable
  public func init() : async () {
    translations := HashMap.fromIter<Text, Translation>(translationsEntries.vals(), 10, Text.equal, Text.hash);
  };

  // Add a new translation to the history
  public func addTranslation(original: Text, translated: Text, targetLanguage: Text) : async () {
    let key = original # targetLanguage;
    let translation : Translation = {
      original = original;
      translated = translated;
      targetLanguage = targetLanguage;
    };
    translations.put(key, translation);
  };

  // Get all translations
  public query func getTranslations() : async [Translation] {
    Iter.toArray(translations.vals())
  };

  // System functions for upgrades
  system func preupgrade() {
    translationsEntries := Iter.toArray(translations.entries());
  };

  system func postupgrade() {
    translations := HashMap.fromIter<Text, Translation>(translationsEntries.vals(), 10, Text.equal, Text.hash);
  };
}
