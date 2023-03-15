#   Domains: 
-   Shops classifications, sys-defined 


# Shops:
-   ACTION addshop(uint8_t domain_id, string shop_name, name owner, string description, string logo, vector<string> urls);
-	ACTION vershop(uint64_t shop_id, name verifier); 
-	ACTION rmshop(uint64_t shop_id);
-   Basic fields + verification + counters + internal use fields 
-   Verification by admin, manual process, it means cannot remove this shop,

#  Info
-   Market general info


#   Collections: 
-   SKUs classifications, sys-defined 


#   Templates: 
-   SKUs classifications, owner-defined (limited) 
-   Every shop has one “General” template
-   Ex: pics of Conan episodes and movies

#   SKUs
-    ACTION addsku(uint64_t shop_id, uint64_t template_id, uint64_t collection_id, string  sku_name, string  description, vector<string> media_list, map<string, string> properities, bool burnable, uint64_t max_supply);
-	ACTION edtskutemp(uint64_t template_id, uint64_t sku_id);
-	ACTION rmsku(uint64_t sku_id); 
-	ACTION rmskuadmin(uint64_t sku_id); 
-	ACTION versku(uint64_t sku_id, name verifier)
-   Basic fields +fks +  verification + counters + internal use fields 
-   Verification by admin, manual process, it means cannot remove this sku, applied on verified shops only 
-   Max supply, burnable 
-   Removeable if only no mint yet (by owner)
-   Removeable if not verified yet (by admin), and erase all minted assets 


#   Categories: 
-   Assets classifications, owner-defined (limited) 
-   Every shop has one “Hidden, For offers, default” categories|
-   Ex: pics of Conan episodes and movies

#   Assets
-	ACTION addsku(uint64_t shop_id, uint64_t template_id, uint64_t collection_id, string  sku_name, string  description, vector<string> media_list, map<string, string> properities, bool burnable, uint64_t max_supply);
-	ACTION edtskutemp(uint64_t template_id, uint64_t sku_id);
-	ACTION rmsku(uint64_t sku_id); 
-	ACTION rmskuadmin(uint64_t sku_id); 
-	ACTION versku(uint64_t sku_id, name verifier)
-   Basic fields +fks +  states + counters + internal use fields + owners + price + history 


#   Auctions: 
-   Basic fields +fks +  states +  internal use fields + owners + min bid price + bidder + history 

#   Offers: 
-   Basic fields +fks +  states +  sender and receiver  

#   Bidders: 
-   Basic fields +fks +  states +  internal use fields + owners + min bid price + bidder + history 

#   Lock Balances: 
-   Locked for bid auction & send offer 



