import React from "react";
import { Layout, Row, Col, Button } from "antd";
import { useEffect, useState } from "react";

import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Aptos } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const aptos = new Aptos();

function App() {

  const { account } = useWallet();

  const [accountHasList, setAccountHasList] = useState<boolean>(false);

  const fetchList = async () => {
    if (!account) return [];
    // change this to be your module account address
    const moduleAddress = "b50f46b6344af99dd208f35e780b7803ccbfb4a626389e139f2215afb70a1e56";
    try {
      const todoListResource = await aptos.getAccountResource(
        {
          accountAddress:account?.address,
          resourceType:`${moduleAddress}::todolist::TodoList`
        }
      );
      setAccountHasList(true);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [account?.address]);

  return (
    <>
    <Layout>
      <Row align="middle">
        <Col span={10} offset={2}>
          <h1>Our todolist</h1>
        </Col>
        <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
          <WalletSelector />
        </Col>
      </Row>
    </Layout>
    {!accountHasList && (
      <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
        <Col span={8} offset={8}>
          <Button
            block
            type="primary"
            style={{ height: "40px", backgroundColor: "#3f67ff" }}
          >
            Add new list
          </Button>
        </Col>
      </Row>
    )}
  </>
  );
}

export default App;
