import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "@/hooks/useTransactions";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionFound";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();

  const {
    transactions,
    summary,
    isLoading,
    error,
    loadData,
    deleteTransaction,
  } = useTransactions(user?.id);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const handleDelete = async (transactionId) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(transactionId),
        },
      ]
    );
  };

  // Loading Screen
  if (isLoading) return <PageLoader />;

  // Error Screen
  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "red", marginBottom: 10 }}>
          Error loading data
        </Text>
        <Text style={{ color: "#666", textAlign: "center", marginBottom: 20 }}>
          {error.message}
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { width: 120, height: 40 }]}
          onPress={loadData}
        >
          <Text style={styles.addButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // MAIN SCREEN
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT SIDE (logo + welcome) */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          {/* RIGHT SIDE (add + signout) */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>

            <SignOutButton />
          </View>
        </View>

        {/* BALANCE CARD */}
        <BalanceCard summary={summary} />

        {/* SECTION TITLE */}
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

        {/* TRANSACTIONS LIST */}
        <FlatList
          style={styles.transactionsList}
          contentContainerStyle={styles.transactionsListContent}
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransactionItem item={item} onDelete={handleDelete} />
          )}
          ListEmptyComponent={<NoTransactionsFound />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
