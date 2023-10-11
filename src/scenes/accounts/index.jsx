import { Box } from "@mui/material";

import Header from "../../components/Header";
import AccountCard from "../../components/AccountCard";
import LinkAccount from "../../components/LinkAccount";

import accountLinks from "../../data/accountLinks";

const Accounts = () => {
  return (
    <Box m="20px">
      <Header
        title="DATA SOURCES"
        subtitle="Manage Your External Data Sources"
      />
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap="20px">
        {accountLinks.map((account, index) => (
          <AccountCard key={index} account={account} />
        ))}
        <LinkAccount />
      </Box>
    </Box>
  );
};

export default Accounts;
