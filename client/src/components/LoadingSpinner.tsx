import React from "react";
import styled from "styled-components";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)] flex items-center justify-center">
      <StyledWrapper>
        <div className="wrapper">
          <div className="blue ball" />
          <div className="red ball" />
          <div className="yellow ball" />
          <div className="green ball" />
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .ball {
    --size: 16px;
    width: var(--size);
    height: var(--size);
    border-radius: 11px;
    margin: 0 10px;

    animation: 2s bounce ease infinite;
  }

  .blue {
    background-color: #27a68850;
  }

  .red {
    background-color: #e74b7c;
    animation-delay: 0.25s;
  }

  .yellow {
    background-color: #f6ab5e;
    animation-delay: 0.5s;
  }

  .green {
    background-color: #27a689;
    animation-delay: 0.75s;
  }

  @keyframes bounce {
    50% {
      transform: translateY(25px);
    }
  }
`;

export default Loader;
