import { cloneElement, ReactElement } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

interface IActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

const ActiveLink = ({
  children,
  activeClassName,
  ...rest
}: IActiveLinkProps) => {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : "";

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
};

export default ActiveLink;
